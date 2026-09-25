param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$frameSize = 64
$visibleSize = 60
$alphaThreshold = 32
$opaqueThreshold = 96
$stateNames = @('idle', 'walk-right', 'walk-left', 'sit')
$referenceRoot = Join-Path $ProjectRoot 'dist\assets\pixel-pets\reference'
$assetRoot = Join-Path $ProjectRoot 'src\assets\pixel-pets'

function Get-OpaqueRuns {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [ValidateSet('Rows', 'Columns')][string]$Axis,
    [int]$Start = 0,
    [int]$End = -1
  )

  if ($Axis -eq 'Rows') {
    $length = $Bitmap.Height
    $crossStart = 0
    $crossEnd = $Bitmap.Width - 1
  } else {
    $length = $Bitmap.Width
    $crossStart = $Start
    $crossEnd = if ($End -ge 0) { $End } else { $Bitmap.Height - 1 }
  }

  $occupied = New-Object bool[] $length
  for ($index = 0; $index -lt $length; $index += 1) {
    for ($cross = $crossStart; $cross -le $crossEnd; $cross += 1) {
      $pixel = if ($Axis -eq 'Rows') {
        $Bitmap.GetPixel($cross, $index)
      } else {
        $Bitmap.GetPixel($index, $cross)
      }

      if ($pixel.A -ge $alphaThreshold) {
        $occupied[$index] = $true
        break
      }
    }
  }

  $runs = @()
  $runStart = -1
  for ($index = 0; $index -lt $length; $index += 1) {
    if ($occupied[$index] -and $runStart -lt 0) {
      $runStart = $index
    }

    $isRunEnd = $runStart -ge 0 -and ((-not $occupied[$index]) -or $index -eq $length - 1)
    if ($isRunEnd) {
      $runEnd = if ($occupied[$index]) { $index } else { $index - 1 }
      $runs += [System.Drawing.Rectangle]::new($runStart, 0, $runEnd - $runStart + 1, 1)
      $runStart = -1
    }
  }

  return $runs
}

function Get-FrameRectangles {
  param([System.Drawing.Bitmap]$Bitmap)

  $rowRuns = Get-OpaqueRuns -Bitmap $Bitmap -Axis Rows
  if ($rowRuns.Count -ne 4) {
    throw "Expected four animation rows, found $($rowRuns.Count)."
  }

  $frames = @()
  foreach ($rowRun in $rowRuns) {
    $rowTop = $rowRun.X
    $rowBottom = $rowTop + $rowRun.Width - 1
    $columnRuns = Get-OpaqueRuns -Bitmap $Bitmap -Axis Columns -Start $rowTop -End $rowBottom
    if ($columnRuns.Count -ne 4) {
      throw "Expected four frames in row $rowTop, found $($columnRuns.Count)."
    }

    foreach ($columnRun in $columnRuns) {
      $frames += [System.Drawing.Rectangle]::new(
        $columnRun.X,
        $rowTop,
        $columnRun.Width,
        $rowRun.Width
      )
    }
  }

  return $frames
}

function Copy-CleanFrame {
  param(
    [System.Drawing.Bitmap]$Source,
    [System.Drawing.Rectangle]$SourceRect
  )

  $clean = [System.Drawing.Bitmap]::new(
    $SourceRect.Width,
    $SourceRect.Height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )

  for ($y = 0; $y -lt $SourceRect.Height; $y += 1) {
    for ($x = 0; $x -lt $SourceRect.Width; $x += 1) {
      $color = $Source.GetPixel($SourceRect.X + $x, $SourceRect.Y + $y)
      if ($color.A -lt $opaqueThreshold) {
        $clean.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      } else {
        $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $color.R, $color.G, $color.B))
      }
    }
  }

  return $clean
}

function Export-PetStrips {
  param(
    [ValidateSet('cat', 'dog')][string]$Pet,
    [string]$SourcePath
  )

  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  try {
    $rectangles = Get-FrameRectangles -Bitmap $source
    $maxWidth = ($rectangles | Measure-Object -Property Width -Maximum).Maximum
    $maxHeight = ($rectangles | Measure-Object -Property Height -Maximum).Maximum
    $scale = [Math]::Min($visibleSize / $maxWidth, $visibleSize / $maxHeight)
    $petOutput = Join-Path $assetRoot $Pet
    New-Item -ItemType Directory -Force -Path $petOutput | Out-Null

    for ($stateIndex = 0; $stateIndex -lt $stateNames.Count; $stateIndex += 1) {
      $strip = [System.Drawing.Bitmap]::new(
        $frameSize * 4,
        $frameSize,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
      )
      $graphics = [System.Drawing.Graphics]::FromImage($strip)

      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

        for ($frameIndex = 0; $frameIndex -lt 4; $frameIndex += 1) {
          $sourceRect = $rectangles[$stateIndex * 4 + $frameIndex]
          $cleanFrame = Copy-CleanFrame -Source $source -SourceRect $sourceRect
          try {
            $targetWidth = [Math]::Max(1, [Math]::Round($sourceRect.Width * $scale))
            $targetHeight = [Math]::Max(1, [Math]::Round($sourceRect.Height * $scale))
            $targetX = $frameIndex * $frameSize + [Math]::Floor(($frameSize - $targetWidth) / 2)
            $targetY = 62 - $targetHeight
            $targetRect = [System.Drawing.Rectangle]::new($targetX, $targetY, $targetWidth, $targetHeight)
            $graphics.DrawImage(
              $cleanFrame,
              $targetRect,
              0,
              0,
              $cleanFrame.Width,
              $cleanFrame.Height,
              [System.Drawing.GraphicsUnit]::Pixel
            )
          } finally {
            $cleanFrame.Dispose()
          }
        }

        $outputPath = Join-Path $petOutput "$($stateNames[$stateIndex]).png"
        $strip.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      } finally {
        $graphics.Dispose()
        $strip.Dispose()
      }
    }
  } finally {
    $source.Dispose()
  }
}

New-Item -ItemType Directory -Force -Path (Join-Path $assetRoot 'reference') | Out-Null
Copy-Item -LiteralPath (Join-Path $referenceRoot 'cat-pixel-reference.png') -Destination (Join-Path $assetRoot 'reference\cat-pixel-reference.png') -Force
Copy-Item -LiteralPath (Join-Path $referenceRoot 'dog-pixel-reference.png') -Destination (Join-Path $assetRoot 'reference\dog-pixel-reference.png') -Force

Export-PetStrips -Pet cat -SourcePath (Join-Path $referenceRoot 'cat-pixel-reference.png')
Export-PetStrips -Pet dog -SourcePath (Join-Path $referenceRoot 'dog-pixel-reference.png')

Write-Output "Pixel pet strips written to $assetRoot"
