// scenarioService.js - Educational Rescue Scenario Service for Trạm Yêu Thương
// Encapsulates scenario retrieval, resilient offline fallback, and DỪNG - NHÌN - GIÚP - GỌI framework data.
//
// NOTE: The current visible application UI (LearnToHelpSection.jsx) intentionally renders
// directly from verified static content (RESCUE_SCENARIOS in mockData.js) to guarantee instant,
// zero-latency rendering and maintain the frozen UI contract.
// fetchScenarios is maintained as a resilient utility with verified fallback for future remote sync.

import { RESCUE_SCENARIOS } from '../data/mockData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export const FRAMEWORK_STEPS = [
  {
    step: 1,
    key: 'DỪNG',
    title: 'DỪNG',
    subtitle: 'An toàn giao thông & Bình tĩnh',
    color: '#e65100',
    bg: '#fff5ec',
    border: '#ffd8be',
    iconGlyph: '🛑',
    summary: 'Dừng lại ở vị trí an toàn. Giữ cự ly 3-5m, không lao tới vồ bắt khiến bé hoảng loạn phóng ra đường.'
  },
  {
    step: 2,
    key: 'NHÌN',
    title: 'NHÌN',
    subtitle: 'Quan sát bối cảnh & Thân nhiệt',
    color: '#1e7046',
    bg: '#f0f9f4',
    border: '#c4e8d3',
    iconGlyph: '👁️',
    summary: 'Quan sát tình trạng: bé có bị gãy xương, say nắng, hạ thân nhiệt hay là mèo sơ sinh chưa mở mắt.'
  },
  {
    step: 3,
    key: 'GIÚP',
    title: 'GIÚP',
    subtitle: 'Hỗ trợ chừng mực & Cấp nước',
    color: '#b05c30',
    bg: '#fff8f2',
    border: '#fedbc5',
    iconGlyph: '🤝',
    summary: 'Đặt nước sạch và thức ăn nhẹ từ xa để xoa dịu. Không tự ý cho uống sữa bò tươi hay ép ăn khi bé run rẩy.'
  },
  {
    step: 4,
    key: 'GỌI',
    title: 'GỌI',
    subtitle: 'Biết giới hạn & Kết nối cứu hộ',
    color: '#4338ca',
    bg: '#f3f1fe',
    border: '#d6d0fb',
    iconGlyph: '📞',
    summary: 'Gửi tọa độ chính xác và hình ảnh hiện trường cho trạm cứu hộ địa phương khi ca bệnh vượt quá khả năng.'
  }
];

/**
 * Fetch active scenarios with resilient offline fallback
 * @returns {Promise<Array>} Array of scenarios
 */
export async function fetchScenarios() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[scenarioService] Using verified fallback scenarios:', err?.message || err);
    }
  }

  // Resilient fallback to verified content (FR-040, FR-046)
  return RESCUE_SCENARIOS;
}

