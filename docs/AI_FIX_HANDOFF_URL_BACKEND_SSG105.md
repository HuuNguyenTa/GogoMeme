# BÁO CÁO BÀN GIAO FIX URL & BACKEND
## Dự án SSG105 – Trạm Yêu Thương

**Mục tiêu tài liệu:** bàn giao context kỹ thuật cho AI coding agent để sửa lỗi URL/backend mà **không thay đổi giao diện hiện tại**.

**Trạng thái sản phẩm hiện tại:** giao diện đã được team chấp nhận và xem như hoàn thiện. Website được giữ theo hướng **single-page landing page / interactive journey**, không chuyển sang kiến trúc nhiều page/route.

---

# 1. NGUYÊN TẮC BẮT BUỘC

## 1.1. Không được thay đổi giao diện

Trong đợt fix này, **UI là vùng đóng băng**.

Không được tự ý:
- redesign section;
- thay layout;
- đổi màu;
- đổi font;
- đổi spacing;
- đổi kích thước;
- đổi animation;
- đổi hiệu ứng 3D;
- đổi illustration/image;
- đổi nội dung/copy;
- đổi thứ tự section;
- đổi class CSS vì mục đích refactor;
- rewrite component chỉ để “code đẹp hơn”;
- chuyển sang Tailwind;
- chuyển sang TypeScript;
- thêm React Router chỉ vì agent thích kiến trúc route;
- thay đổi visual behavior hiện đang được team chấp nhận.

Các file style/visual như sau nên được xem là **read-only**, trừ khi có bug kỹ thuật bắt buộc và phải giải thích trước:
- `src/styles/landing.css`
- `src/styles/hero.css`
- `src/styles/mobile.css`
- `src/styles/night-theme.css`
- `src/components/hero/*`
- các component 3D/illustration hiện tại.

Nếu cần sửa JSX, chỉ sửa **state / event handler / URL logic / data logic**, không thay markup hoặc CSS class trừ khi thật sự cần cho bug.

## 1.2. Product decision đã chốt

Website **cố ý là one-page**.

Không chuyển thành:
- `/choose`
- `/wish`
- `/station`
- `/scenarios`
- `/rescue-centers`

dưới dạng các React route độc lập.

Core journey vẫn là:

`Choose Animal → Write Wish → Rescue Station → Scenarios → Rescue Support`

nhưng toàn bộ nằm trong cùng landing page.

## 1.3. Wish moderation không nằm trong scope

Product decision hiện tại:
- người dùng gửi lời chúc;
- lời chúc được publish ngay;
- không có bước admin duyệt thủ công.

**Không được tự ý khôi phục `pending → approve → public`.**

## 1.4. Wish submit hiện đang hoạt động

Trong môi trường hiện tại:
- người dùng nhập lời chúc;
- submit thành công;
- lời chúc xuất hiện trong Khu Vườn Yêu Thương.

Đây là behavior đang đúng.

Khi fix backend:
- không được phá flow này;
- không thay đổi UI submit;
- không thêm bước xác nhận mới;
- không đổi wording;
- không làm mất realtime behavior.

---

# 2. PHẠM VI FIX

Đợt này chỉ tập trung vào:

1. URL/history của one-page app.
2. Refresh/F5/direct navigation.
3. Browser Back/Forward.
4. Đồng bộ state của Choose/Write Wish với URL.
5. Backend contract Supabase trong source code/migration.
6. Scenario data/service consistency.
7. Garden state/performance bugs nhỏ nếu xác nhận được.
8. Developer setup/build consistency.

Không làm thêm feature mới.

---

# 3. BUG P0 – REFRESH TẠI `/rescue-station` BỊ 404

## Hiện trạng

`ChooseFriendPreview.jsx` đang thay đổi URL bằng:

```js
window.history.pushState(null, '', `/write-wish/${animal.id}`);
```

và sau khi submit:

```js
window.history.pushState(null, '', '/rescue-station');
```

App thực tế không có router tương ứng.

Trong phiên hiện tại, `pushState()` chỉ thay URL và React app vẫn đang sống nên mọi thứ trông bình thường.

Nhưng khi F5 tại:

```text
/rescue-station
```

browser gửi request thật đến server.

Server không có route/file `/rescue-station` nên có thể trả 404.

## Expected

- Submit wish xong vẫn đi đến Garden.
- F5 không bao giờ 404.
- Direct reload vẫn tải landing page.
- Không cần React Router.

## Hướng fix ưu tiên

Vì app là one-page, dùng **hash URL làm canonical navigation**.

Ví dụ:

```text
/#choose
/#/write-wish/dog-bo
/#/rescue-station
/#scenarios
```

Internal navigation không được dùng pathname giả nữa.

Thay:

```js
history.pushState(null, '', `/write-wish/${animal.id}`)
```

bằng URL dạng hash.

Thay:

```js
history.pushState(null, '', '/rescue-station')
```

bằng URL dạng hash.

Browser refresh hash URL chỉ request `/`, nên không tạo 404 server-side.

### Lưu ý

Không chỉ thay string.

App phải đọc hash khi khởi động để restore đúng:
- selected animal;
- mode `choose/write`;
- section cần scroll tới.

---

# 4. BUG P0/P1 – BACK / FORWARD KHÔNG ĐỒNG BỘ HOÀN TOÀN VỚI UI STATE

App có listener `popstate`/`hashchange`, nhưng state hiện tại chưa được model hóa rõ thành navigation state.

Rủi ro:
- URL và `mode` khác nhau;
- đang ở Garden nhưng phần Choose/Write phía trên vẫn giữ state không tương ứng;
- Back/Forward scroll đúng section nhưng state form không đúng;
- history stack có thể khó đoán.

## Expected

Các case sau phải ổn định:

### Case A

```text
/
→ chọn Bé Bơ
→ Write Wish
→ Back
```

Kết quả:
- quay lại Choose mode;
- Bé Bơ vẫn có thể là animal đang selected;
- không reload page;
- không 404.

### Case B

```text
Choose
→ Write Wish
→ Submit
→ Rescue Station
→ Back
```

Kết quả phải xác định rõ và nhất quán.

Đề xuất:
- Back quay về Write Wish của animal trước đó;
- state được restore từ URL/hash;
- không tạo UI state mâu thuẫn.

### Case C

Forward lại:
- trở về Rescue Station;
- scroll đúng Garden;
- không submit wish lần hai.

## Việc cần làm

Nên gom parsing/navigation vào utility nhỏ thay vì rải logic string trong component.

Ví dụ có thể tạo:

```text
src/utils/journeyLocation.js
```

với các hàm:
- `parseJourneyLocation()`
- `navigateToChoose()`
- `navigateToWriteWish(animalId)`
- `navigateToRescueStation()`

Không bắt buộc đúng tên này, nhưng mục tiêu là **một source of truth cho URL state**.

---

# 5. BUG P1 – ANIMAL ID KHÔNG HỢP LỆ

Hiện logic đọc `/write-wish/:animalId` hoặc hash tương đương.

Nếu ID không tồn tại:
- `ANIMALS.find()` trả null;
- nhưng code vẫn có thể đưa `mode` sang `write`;
- selected animal cũ/default có thể được dùng.

Ví dụ:

```text
/#/write-wish/not-a-real-animal
```

không được dẫn đến form của một animal khác.

## Expected

Nếu `animalId` không hợp lệ:
- fallback về Choose mode;
- canonical URL trở về `/#choose` hoặc `/`;
- không hiển thị Write Wish với animal không khớp URL.

---

# 6. BACKEND CONSISTENCY – WISH SERVICE VS DATABASE MIGRATION

## Hiện trạng frontend

`wishService.js` cố ý chỉ insert các field thiết yếu:

```js
{
  animal_id,
  animal_type,
  message,
  sender_display_name?
}
```

Metadata animal được resolve từ `animal_id` ở frontend.

Behavior này hiện đang hoạt động trong môi trường đang chạy và **không được phá**.

## Hiện trạng migration trong repo

Migration khởi tạo `public.wishes` có:

```sql
animal_name TEXT NOT NULL
```

Trong khi client không gửi `animal_name`.

Điều này tạo ra một inconsistency quan trọng:

- remote Supabase hiện tại có thể đã khác migration;
- nhưng một database mới dựng lại từ migrations trong repo có thể fail khi insert wish.

## Mục tiêu

Source code + migrations phải mô tả đúng contract mà app thực sự sử dụng.

## Hướng fix an toàn

**Không sửa migration cũ đã có lịch sử.**

Tạo migration mới để align schema với frontend contract.

Ví dụ concept:

```sql
ALTER TABLE public.wishes
ALTER COLUMN animal_name DROP NOT NULL;
```

Nếu các column snapshot như `animal_name`, `animal_breed`, `animal_avatar` không còn là required contract thì để nullable.

Không xóa dữ liệu cũ.

Không đổi behavior publish-immediately hiện tại.

## Trước khi sửa

Agent phải:
1. đọc toàn bộ migrations;
2. đọc `wishService.js`;
3. hiểu rằng live behavior đang chạy;
4. không “fix” bằng cách thêm `animal_name` bắt buộc trở lại client nếu không có lý do rõ ràng.

Ưu tiên contract đơn giản:

```text
animal_id = source of truth
frontend resolves display profile
```

---

# 7. SCENARIO SERVICE ĐANG KHÔNG NHẤT QUÁN

Hiện UI `LearnToHelpSection.jsx` đang sử dụng:

```js
RESCUE_SCENARIOS
```

từ `src/data/mockData.js`.

Trong khi `src/services/scenarioService.js` lại có code tìm:

```js
window.__supabaseClient
```

nhưng app không thiết lập global này theo flow hiện tại.

Kết quả:
- UI thực tế đang dùng static scenarios;
- service tồn tại nhưng không phải source of truth;
- code tạo cảm giác như scenarios đã được kết nối Supabase dù thực tế không phải vậy.

## Quyết định khuyến nghị cho MVP

Giữ scenarios **static** nếu team chưa có nhu cầu chỉnh chúng từ database.

Đây là lựa chọn đơn giản và ổn định nhất.

Khi đó:
- không cần thay UI;
- không cần fetch network;
- không cần loading/error state mới;
- có thể remove/deprecate `scenarioService.js` nếu xác nhận không còn caller.

Nếu muốn giữ service cho tương lai:
- sửa nó import `supabase` từ `supabaseClient.js`;
- nhưng không chuyển UI hiện tại sang remote data trong cùng đợt fix nếu không cần thiết.

**Không over-engineer.**

---

# 8. DEV FALLBACK – WISH KHÔNG PERSIST KHI KHÔNG CÓ SUPABASE

Nếu Supabase env chưa cấu hình:

`submitWish()` tạo object trong memory và UI vẫn hiển thị wish mới.

Nhưng reload:
- object này biến mất;
- `fetchPublicWishes()` quay về `SAMPLE_WISHES`.

Đây không phải blocker production nếu production luôn có Supabase, nhưng là behavior gây nhầm khi dev/demo local.

## Hai lựa chọn hợp lệ

### Option A – Giữ như hiện tại

Nhưng README/dev console phải ghi rõ:

> Mock mode does not persist submitted wishes across reload.

### Option B – LocalStorage fallback

Chỉ dùng khi `!isSupabaseConfigured`.

Yêu cầu:
- không ảnh hưởng production;
- giới hạn số record;
- dữ liệu local chỉ dành cho dev;
- không đổi UI.

Không bắt buộc làm Option B nếu muốn giữ scope nhỏ.

---

# 9. GARDEN FILTER – HIDDEN RESIDENT CÓ THỂ VẪN THAM GIA MOTION ENGINE

UI render list đã filter:

```js
displayedResidents
```

theo:
- all;
- cat;
- dog.

Nhưng motion simulation sử dụng collection residents tổng.

Cần kiểm tra xem resident đang bị filter khỏi DOM có tiếp tục ảnh hưởng collision/movement của resident đang hiển thị hay không.

Nếu đúng:
- filter “Hội Mèo” có thể khiến mèo né các resident chó không nhìn thấy;
- chuyển động có thể trông bất thường.

## Expected

Motion/collision phải chỉ dựa trên các resident thực sự active/visible, hoặc phải có lý do rõ ràng nếu vẫn dùng toàn collection.

## Ràng buộc

Không đổi visual design hoặc animation style.

Chỉ sửa dataset mà engine dùng.

---

# 10. GARDEN – REALTIME RESIDENT CÓ THỂ TĂNG KHÔNG GIỚI HẠN TRONG SESSION

Initial fetch:

```js
.limit(60)
```

nhưng realtime insert tiếp tục append resident mới.

Nếu tab mở lâu:
- array có thể tăng dần;
- collision simulation có thể trở nên nặng;
- đặc biệt trên mobile.

## Expected

Đặt một cap hợp lý cho resident trong Garden, ví dụ khoảng 60–80.

Khi vượt cap:
- giữ resident mới nhất;
- ưu tiên không làm biến mất wish vừa submit của chính user ngay lập tức;
- không thay layout/visual.

Không cần tối ưu sớm quá mức; chỉ implement nếu logic hiện tại thật sự không có giới hạn.

---

# 11. README / NODE VERSION KHÔNG KHỚP DEPENDENCIES

README hiện ghi:

```text
Node.js >= 18
```

Trong khi stack hiện tại dùng version dependency mới hơn.

Cần xác minh `engines`/requirements từ package lock hiện tại và cập nhật README về version Node thực tế được support.

Khuyến nghị môi trường team:

```text
Node.js 22.12+
```

Mục tiêu:
- thành viên mới clone repo;
- `npm ci`;
- `npm run dev`;
- `npm run lint`;
- `npm run build`;

không gặp lỗi chỉ vì Node quá cũ.

---

# 12. KHÔNG ĐƯỢC REFACTOR NGOÀI SCOPE

AI agent không được nhân cơ hội này để:

- đổi framework;
- đổi React version;
- đổi CSS architecture;
- chuyển JS → TS;
- chuyển raw Three.js → React Three Fiber;
- thêm state management library;
- thêm React Router;
- đổi Supabase architecture;
- đổi section order;
- xóa visual assets;
- thay copy;
- “clean up” hàng nghìn dòng CSS;
- đổi component visual structure;
- tạo design system mới.

Nếu phát hiện tech debt ngoài scope:
- ghi vào report;
- không sửa trong task này.

---

# 13. FILE ĐƯỢC PHÉP ƯU TIÊN CHỈNH

Dự kiến:

```text
src/components/sections/ChooseFriendPreview.jsx
src/services/wishService.js
src/services/scenarioService.js
src/services/supabaseClient.js       # chỉ nếu thật sự cần
src/components/sections/RescueStationPreview.jsx
src/utils/...                         # có thể tạo utility URL mới
supabase/migrations/...               # thêm migration mới, không rewrite history
README.md
vercel.json                           # chỉ nếu lựa chọn cần server fallback
```

Các file CSS/3D/visual không nằm trong scope.

---

# 14. THỨ TỰ THỰC HIỆN

## Phase 1 – URL stabilization

1. Xác định canonical one-page URL format.
2. Chuyển navigation nội bộ sang hash.
3. Parse hash lúc app load.
4. Fix Back/Forward.
5. Fix invalid animal ID.
6. Verify no F5 404.

## Phase 2 – Backend consistency

1. Kiểm tra wish client payload.
2. Kiểm tra migrations.
3. Add migration mới để fresh DB tương thích với current frontend.
4. Không thay đổi publish-immediately.
5. Không phá realtime wish.

## Phase 3 – Code consistency

1. Quyết định scenario static.
2. Remove/deprecate broken unused service hoặc sửa import cho đúng.
3. Không thay UI sang remote scenarios nếu không có requirement.

## Phase 4 – Stability

1. Garden filter simulation check.
2. Realtime resident cap nếu cần.
3. Dev fallback behavior.
4. README Node version.

## Phase 5 – Regression check

1. lint;
2. build;
3. manual journey test;
4. mobile smoke test;
5. Supabase persistence test;
6. realtime test.

---

# 15. ACCEPTANCE TESTS

AI không được coi task hoàn thành nếu chưa verify các case sau.

## URL

### Test 1

```text
Open /
→ choose animal
→ continue to Write Wish
```

URL phải chuyển sang canonical one-page location.

F5:
- không 404;
- app mở lại;
- selected animal đúng;
- Write Wish đúng state.

### Test 2

```text
Write Wish
→ Submit
→ Garden
```

URL phải là canonical Garden location.

F5:
- không 404;
- landing page load;
- tự điều hướng/scroll tới Garden đúng behavior đã thiết kế.

### Test 3

Back:
- Garden → Write Wish.

Forward:
- Write Wish → Garden.

Không submit duplicate.

### Test 4

Mở URL với animal ID không tồn tại.

Expected:
- fallback Choose;
- không hiển thị sai animal;
- không crash.

---

## Wish / Supabase

### Test 5

Có Supabase env:

```text
Submit wish
→ success
→ appears in Garden
→ F5
→ wish vẫn tồn tại
```

### Test 6

Mở tab/browser thứ hai:

- wish mới phải xuất hiện theo realtime hoặc sau reload;
- không duplicate.

### Test 7

Fresh database được tạo từ toàn bộ migrations hiện tại + migration mới.

Frontend insert wish phải thành công với payload hiện tại.

---

## Build

Từ clean install:

```bash
npm ci
npm run lint
npm run build
```

Cả ba phải pass.

---

# 16. DEFINITION OF DONE

Task chỉ hoàn tất khi:

- [ ] Không còn F5 404 sau Write Wish/Rescue Station.
- [ ] URL phù hợp với kiến trúc one-page.
- [ ] Back/Forward hoạt động nhất quán.
- [ ] Invalid animal URL được xử lý.
- [ ] Wish submit hiện tại không bị regression.
- [ ] Wish vẫn persist qua Supabase.
- [ ] Realtime không bị phá.
- [ ] Migrations có thể dựng fresh DB tương thích frontend.
- [ ] Scenario code có source of truth rõ ràng.
- [ ] `npm run lint` pass.
- [ ] `npm run build` pass.
- [ ] Không có thay đổi visual ngoài ý muốn.
- [ ] Không sửa CSS/3D chỉ để refactor.
- [ ] Có summary cuối task liệt kê file đã đổi và lý do.

---

# 17. PROMPT DÙNG CHO AI CODING AGENT

Copy nguyên prompt dưới đây cho Codex / Antigravity / Claude Code.

```text
You are fixing URL/navigation and backend consistency issues in the existing
SSG105 "Trạm Yêu Thương" project.

IMPORTANT: THE UI IS ALREADY APPROVED AND MUST NOT BE REDESIGNED.

Before changing anything:
1. Read the current source code.
2. Read this handoff report completely.
3. Inspect package.json, ChooseFriendPreview.jsx, wishService.js,
   scenarioService.js, supabaseClient.js, RescueStationPreview.jsx,
   and all Supabase migrations.
4. Run git status and do not overwrite unrelated work.

NON-NEGOTIABLE PRODUCT DECISIONS:

- This is intentionally a SINGLE-PAGE interactive landing page.
- Do NOT convert it to a multi-page React Router architecture.
- Do NOT add React Router just to solve the URL issue.
- The current UI/visual design is considered finished.
- Do NOT redesign any section.
- Do NOT change colors, typography, spacing, section ordering, animations,
  Three.js scenes, images, copy, visual hierarchy, CSS architecture, or
  responsive design unless a visual change is strictly required to fix a
  verified functional bug.
- Do NOT rewrite CSS.
- Do NOT migrate JS to TypeScript.
- Do NOT replace Three.js or other visual implementation.
- Wishes are intentionally published immediately.
- Do NOT restore manual moderation or pending approval.
- Current wish submission works and wishes appear in the Garden.
  Preserve this behavior and preserve Supabase realtime.

PRIMARY GOAL:

Stabilize the one-page URL/history behavior and backend contracts without
changing the appearance of the website.

TASK 1 — FIX URL / REFRESH 404

Current code uses history.pushState with pathname URLs such as:

/write-wish/:animalId
/rescue-station

There is no actual router for those paths, so refreshing /rescue-station can
return 404.

Use a canonical HASH-BASED navigation model appropriate for a one-page app,
for example:

/#choose
/#/write-wish/:animalId
/#/rescue-station

You may choose equivalent hash names, but keep the solution simple and
consistent.

Requirements:
- internal navigation should not create fake server routes;
- refreshing any journey state must not 404;
- parse location on initial app load;
- restore selected animal and write mode when opening the write-wish hash;
- restore/scroll to Garden when opening the rescue-station hash;
- browser Back and Forward must keep URL, state, and scroll destination
  consistent;
- do not cause duplicate wish submissions;
- handle hashchange and popstate correctly;
- an invalid animal ID must gracefully return to Choose mode instead of
  displaying a different/default animal under a wrong URL.

Prefer extracting URL parsing/navigation helpers into a small utility if that
reduces duplicated logic. Do not over-engineer.

TASK 2 — ALIGN SUPABASE MIGRATIONS WITH THE WORKING FRONTEND CONTRACT

The current frontend wish payload intentionally stores only essential fields:

animal_id
animal_type
message
sender_display_name (optional)

The frontend resolves animal metadata from animal_id.

However, an existing migration defines animal_name as NOT NULL, which means a
fresh database reconstructed from repo migrations may reject the frontend
payload.

Do NOT rewrite old migration history.

Add a NEW migration that makes the schema compatible with the CURRENT working
frontend contract, preserving existing rows and publish-immediately behavior.

Do not change the live wish UX.
Do not add moderation.
Do not break realtime.

Before making the migration, inspect all existing migrations and confirm the
minimum safe SQL change.

TASK 3 — SCENARIO SOURCE OF TRUTH

The visible scenario UI currently reads RESCUE_SCENARIOS from mockData.js.

scenarioService.js contains a window.__supabaseClient path that is not the
actual client integration used elsewhere.

For the current MVP, prefer keeping scenarios STATIC unless the existing app
already depends on remote scenario data.

If scenarioService.js is unused:
- either remove/deprecate the dead path safely,
- or make the service internally correct without switching the UI to remote
  data.

Do not introduce new loading states or visual changes.

TASK 4 — VERIFY GARDEN LOGIC WITHOUT REDESIGN

Inspect the Garden logic for two specific issues:

A. When filtering cats/dogs, verify hidden residents are not incorrectly
   influencing motion/collision of visible residents.

B. Initial fetch is capped, but realtime inserts may accumulate indefinitely
   during a long session. If confirmed, add a reasonable in-memory cap while
   preserving the user's newest/local wish.

Only change logic. Do not alter the Garden appearance or animation design.

TASK 5 — DEV/PROJECT CONSISTENCY

- Verify behavior when Supabase is not configured.
- It is acceptable to keep mock submissions non-persistent, but document that
  clearly; alternatively add a dev-only localStorage fallback if it can be
  done cleanly without affecting production.
- Update README Node requirement to match actual current dependencies.
- Do not upgrade dependencies unless required for the bug fixes.

VALIDATION:

Run from my-landing-page:

npm ci
npm run lint
npm run build

Then verify manually:

1. /
2. choose an animal
3. enter Write Wish
4. F5 — no 404, same animal/write state
5. submit wish
6. arrive at Garden
7. F5 — no 404
8. Back — returns consistently to Write Wish
9. Forward — returns consistently to Garden
10. invalid animal hash — falls back safely
11. Supabase wish persists after reload
12. wish appears in another tab/realtime
13. no duplicate wish
14. desktop appearance unchanged
15. mobile appearance unchanged

CHANGE CONTROL:

Do not touch unrelated visual code.

If you believe a visual/CSS/3D change is necessary:
STOP and explain why before making it.

At the end, report:
- root cause of each bug;
- files changed;
- exact behavior changed;
- migrations added;
- tests/commands run and their results;
- any remaining risks or items intentionally left unchanged.
```

---

# 18. GỢI Ý CÁCH LÀM VỚI AI

Không nên prompt AI “fix everything” rồi để nó tự chạy hàng trăm file.

Workflow an toàn hơn:

```text
Step 1:
Read report + inspect repo.
Return implementation plan only.
Do not edit yet.

Step 2:
Fix URL/history only.
Run lint/build.
Show changed files.

Step 3:
Fix Supabase migration consistency only.
Run checks.

Step 4:
Clean scenario service + Garden verified bugs.
Run checks.

Step 5:
Final regression review.
```

Điều này giúp tránh agent nhân tiện “refactor” luôn phần giao diện đã hoàn thiện.

---

# 19. KẾT LUẬN

Tình trạng hiện tại nên được coi là:

```text
VISUAL / UI
≈ DONE

CORE WISH FLOW
≈ WORKING

URL / HISTORY
= NEEDS STABILIZATION

BACKEND CONTRACT
= NEEDS CLEANUP / REPRODUCIBILITY

QA / DEPLOYMENT
= NEXT PHASE
```

Mục tiêu của đợt tiếp theo không phải “làm website đẹp hơn”.

Mục tiêu là:

> **Giữ nguyên toàn bộ trải nghiệm đã được team chấp nhận, nhưng làm cho URL, reload, history, database contract và production behavior đủ ổn định để demo/deploy thật.**
