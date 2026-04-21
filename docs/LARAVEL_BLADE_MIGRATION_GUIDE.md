# Laravel Blade Migration Guide (Full Project)

## 1) What this current project is

This repository is a **monolithic Node.js app**:

- **Frontend:** Next.js (Pages Router) + React + Tailwind
- **Backend API:** Express (`server.js`) with routes under `Backend/routes`
- **Database:** MySQL (`mysql2`), raw SQL in model files
- **Auth:** JWT in `authToken` cookie
- **Uploads:** local files in `Backend/uploads`, served by `/uploads`

There are no migration files and no test suite in the current app.

---

## 2) Current module inventory (what must be rebuilt in Laravel)

## Public/website features

- Home page sections: slider, about, teacher list, notices, awards, news/events, result search
- Teacher/staff listing
- Committee member listing
- Gallery
- Notice board + notice details
- Contact page
- Public student result search + grouped summary

## Admin features

- Login/logout + role-based access (`headmaster`, `teacher`, `principal`)
- Slider CRUD
- Award CRUD
- Gallery CRUD
- Director/committee CRUD
- Class CRUD
- Section CRUD
- Teacher-section assignment CRUD
- Teacher CRUD (user management)
- Student CRUD + Excel import
- Daily attendance (per student) + report
- Quick attendance (aggregate) + report
- Notice CRUD
- Student result CRUD + Excel upload + bulk delete + grouped summary
- Subject configuration CRUD
- Tabulation/report UI

## Database tables found in code

- `users`
- `students`
- `classes`
- `sections`
- `teacher_sections`
- `attendance`
- `quick_attendance`
- `student_results`
- `subject_config`
- `notices`
- `slider`
- `awards`
- `gallery`
- `board_of_directors`
- `activities`
- `news`
- `branch`

---

## 3) Laravel target architecture (recommended)

Use **Laravel + Blade + MySQL** in one app:

- Blade for all public and admin UIs
- Eloquent models for all tables
- Form Request validation
- Middleware-based role guards
- Laravel Storage for uploads
- Optional: queue/jobs for heavy imports later

Recommended structure:

- `app/Models/*` -> each table model
- `app/Http/Controllers/Public/*`
- `app/Http/Controllers/Admin/*`
- `app/Http/Controllers/Auth/*`
- `app/Http/Requests/*` for validation
- `resources/views/layouts/*`
- `resources/views/public/*`
- `resources/views/admin/*`
- `routes/web.php` for Blade routes
- `routes/api.php` only if you keep API endpoints

---

## 4) Exact setup commands (fresh Laravel Blade project)

> Run these commands in your terminal. Adjust DB credentials for your machine.

```bash
# 1) Create new Laravel app
composer create-project laravel/laravel bhs-laravel
cd bhs-laravel

# 2) Basic app key and env
cp .env.example .env
php artisan key:generate

# 3) Install auth scaffolding (Blade)
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install
npm run build

# 4) Role/permission package (recommended)
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# 5) Create storage symlink for uploads
php artisan storage:link

# 6) Create all models+migrations+controllers+requests
php artisan make:model Slider -mcr
php artisan make:model Award -mcr
php artisan make:model GalleryItem -mcr
php artisan make:model Director -mcr
php artisan make:model SchoolClass -mcr
php artisan make:model Section -mcr
php artisan make:model Student -mcr
php artisan make:model TeacherSection -mcr
php artisan make:model Attendance -mcr
php artisan make:model QuickAttendance -mcr
php artisan make:model StudentResult -mcr
php artisan make:model SubjectConfig -mcr
php artisan make:model Notice -mcr
php artisan make:model Activity -mcr
php artisan make:model News -mcr
php artisan make:model Branch -mcr

# Optional dedicated admin/public controllers
php artisan make:controller Public/HomeController
php artisan make:controller Public/NoticeController
php artisan make:controller Public/GalleryController
php artisan make:controller Public/ResultSearchController

php artisan make:controller Admin/DashboardController
php artisan make:controller Admin/UserController
php artisan make:controller Admin/ClassController
php artisan make:controller Admin/SectionController
php artisan make:controller Admin/TeacherSectionController
php artisan make:controller Admin/StudentController
php artisan make:controller Admin/AttendanceController
php artisan make:controller Admin/QuickAttendanceController
php artisan make:controller Admin/StudentResultController
php artisan make:controller Admin/SubjectConfigController
php artisan make:controller Admin/NoticeController
php artisan make:controller Admin/SliderController
php artisan make:controller Admin/AwardController
php artisan make:controller Admin/GalleryController
php artisan make:controller Admin/DirectorController

# Requests (validation)
php artisan make:request StoreStudentRequest
php artisan make:request UpdateStudentRequest
php artisan make:request StoreStudentResultRequest
php artisan make:request UpdateStudentResultRequest
php artisan make:request StoreQuickAttendanceRequest
php artisan make:request StoreAttendanceRequest

# Middleware for role-based access
php artisan make:middleware RoleMiddleware
```

---

## 5) .env settings you need

```dotenv
APP_NAME="BHS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bhs
DB_USERNAME=root
DB_PASSWORD=your_password

FILESYSTEM_DISK=public
```

Then:

```bash
php artisan config:clear
php artisan cache:clear
```

---

## 6) Database migration blueprint (from your existing SQL usage)

Because the current app has no migration files, first inspect production/local schema:

```bash
# run in mysql shell
SHOW CREATE TABLE users;
SHOW CREATE TABLE students;
SHOW CREATE TABLE classes;
SHOW CREATE TABLE sections;
SHOW CREATE TABLE teacher_sections;
SHOW CREATE TABLE attendance;
SHOW CREATE TABLE quick_attendance;
SHOW CREATE TABLE student_results;
SHOW CREATE TABLE subject_config;
SHOW CREATE TABLE notices;
SHOW CREATE TABLE slider;
SHOW CREATE TABLE awards;
SHOW CREATE TABLE gallery;
SHOW CREATE TABLE board_of_directors;
SHOW CREATE TABLE activities;
SHOW CREATE TABLE news;
SHOW CREATE TABLE branch;
```

Minimum column requirements inferred from code:

- `users`: username, password, full_name, role, phone, gender, expertise, address, position, description, plain_password, image, timestamps
- `students`: user_id, section_id, name, phone, address, position, image, email, gender, expertise
- `classes`: className
- `sections`: sectionName, classId, total_male, total_female, total_students
- `teacher_sections`: user_id, section_id, is_primary
- `attendance`: student_id, attendance_date, status, recorded_by, remarks
- `quick_attendance`: section_id, attendance_date, male_count, female_count, total_male, total_female, total_students, absent_student_ids, recorded_by
- `student_results`: all exam fields currently used (many columns)
- `subject_config`: class_level, group_name(optional), and subject metadata fields used by UI
- `notices`: title, date, content, badge
- `slider`: image
- `awards`: title, subtitle, image
- `gallery`: image, title, description, category
- `board_of_directors`: image_url, name, position, details, description, committee
- `activities`: image, title, date, author
- `news`: image, title, description
- `branch`: image_url, branch_name, branch_address, branch_email, branch_incharge, branch_phone

Important DB rule from existing attendance logic:

- Add unique index on attendance to preserve upsert behavior:
  - `(student_id, attendance_date)` should be unique

---

## 7) Route mapping: current app -> Laravel routes

## Public routes (`routes/web.php`)

- `/` -> HomeController@index
- `/teachers-and-staff` -> Public teacher page
- `/committee-members` -> Public committee page
- `/gallery` -> Public gallery page
- `/notice` -> Public notice list
- `/notice/{id}` -> Public notice details
- `/contact` -> Contact page
- `/student-result` -> result search form

## Auth routes

- Use Breeze defaults (`/login`, `/logout`, etc.)
- Add role redirect after login:
  - headmaster -> `/admin/dashboard`
  - teacher -> `/admin/dashboard` (or teacher-specific)

## Admin routes (`auth` + role middleware)

- `/admin/dashboard`
- `/admin/sliders` (CRUD)
- `/admin/awards` (CRUD)
- `/admin/gallery` (CRUD)
- `/admin/directors` (CRUD)
- `/admin/classes` (CRUD)
- `/admin/sections` (CRUD)
- `/admin/teacher-sections` (CRUD)
- `/admin/teachers` (CRUD users)
- `/admin/students` (CRUD + Excel import)
- `/admin/attendance` (bulk record + report)
- `/admin/quick-attendance` (record + report)
- `/admin/notices` (CRUD)
- `/admin/student-results` (CRUD + upload + bulk delete)
- `/admin/subject-config` (CRUD)

---

## 8) Roles and authorization in Laravel

Use Spatie:

```bash
php artisan migrate
php artisan db:seed
```

In seeders, create roles:

- `headmaster`
- `teacher`
- `principal` (optional if you keep current behavior)

Assign role to users; protect routes:

- `->middleware(['auth', 'role:headmaster'])` for full admin
- `->middleware(['auth', 'role:headmaster|teacher'])` for attendance/result operations

---

## 9) Blade template conversion map

## Layouts

- Current public layout -> `resources/views/layouts/public.blade.php`
- Current admin layout/sidebar -> `resources/views/layouts/admin.blade.php`

## Public pages to create

- `resources/views/public/home.blade.php`
- `resources/views/public/teachers.blade.php`
- `resources/views/public/committee.blade.php`
- `resources/views/public/gallery.blade.php`
- `resources/views/public/notices/index.blade.php`
- `resources/views/public/notices/show.blade.php`
- `resources/views/public/contact.blade.php`
- `resources/views/public/results/search.blade.php`

## Admin pages to create

- `resources/views/admin/dashboard.blade.php`
- `resources/views/admin/sliders/index.blade.php`
- `resources/views/admin/awards/index.blade.php`
- `resources/views/admin/gallery/index.blade.php`
- `resources/views/admin/directors/index.blade.php`
- `resources/views/admin/classes/index.blade.php`
- `resources/views/admin/sections/index.blade.php`
- `resources/views/admin/teacher_sections/index.blade.php`
- `resources/views/admin/teachers/index.blade.php`
- `resources/views/admin/students/index.blade.php`
- `resources/views/admin/attendance/index.blade.php`
- `resources/views/admin/quick_attendance/index.blade.php`
- `resources/views/admin/notices/index.blade.php`
- `resources/views/admin/student_results/index.blade.php`
- `resources/views/admin/subject_config/index.blade.php`

---

## 10) File upload migration plan (important)

Current app stores filenames and serves `/uploads/*`.

Laravel equivalent:

- Store in `storage/app/public/uploads/...`
- Save path in DB (for example: `uploads/sliders/file.jpg`)
- Access with:
  - `Storage::url($path)`
  - `<img src="{{ Storage::url($item->image) }}">`

For forms:

- Validate with `image|mimes:jpg,jpeg,png,gif,webp|max:5120`
- On update, delete old file if replaced

---

## 11) Student result module strategy (critical module)

`student_results` currently uses a very wide table (many subject columns).  
For fast parity migration, keep same structure first:

1. Keep wide table schema exactly
2. Move existing Excel import logic into Laravel-Excel or PhpSpreadsheet service
3. Keep current filters:
   - by name/roll/year
   - grouped summary by class/section/year
4. Rebuild admin edit form as Blade tabs/sections (do not attempt full redesign first)

Later optimization (phase 2):

- Normalize into `exam_results`, `result_subject_marks`, `subjects`

---

## 12) Attendance migration notes

## Normal attendance

- Keep per-student attendance table
- Keep enum statuses used now: `present`, `absent`, `late`, `excused`
- Preserve unique `(student_id, attendance_date)` logic

## Quick attendance

- Keep aggregate counts per section/date
- Keep report filters:
  - date
  - date range
  - section
  - class
  - teacher

---

## 13) Data migration (existing MySQL -> Laravel)

If Laravel app uses same database:

- Point `.env` to current DB
- Create migrations carefully (or map to existing tables names)

If moving to new DB:

1. Export old DB
2. Import into new DB
3. Run Laravel migration adjustments
4. Validate row counts and key joins

Validation SQL examples:

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM student_results;
SELECT COUNT(*) FROM attendance;
SELECT COUNT(*) FROM quick_attendance;
```

---

## 14) Suggested implementation order

1. Bootstrap Laravel + auth + role middleware
2. Migrations/models for foundational entities (`users`, `classes`, `sections`, `students`)
3. Public pages (home/notices/gallery/search)
4. Admin core CRUD (class/section/teacher/student)
5. Attendance + quick attendance
6. Student results + Excel import
7. Remaining modules (slider/award/director/gallery polish)
8. QA + production deploy

---

## 15) Route skeleton example (`routes/web.php`)

```php
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\NoticeController as PublicNoticeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\StudentController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/notice', [PublicNoticeController::class, 'index'])->name('notice.index');
Route::get('/notice/{notice}', [PublicNoticeController::class, 'show'])->name('notice.show');

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:headmaster')->group(function () {
        Route::resource('classes', ClassController::class);
        Route::resource('sections', SectionController::class);
    });

    Route::middleware('role:headmaster|teacher')->group(function () {
        Route::resource('students', StudentController::class);
    });
});
```

---

## 16) Commands checklist for full migration execution

```bash
# after creating project and scaffolding
php artisan migrate
php artisan db:seed
php artisan storage:link
npm run build
php artisan serve
```

During development:

```bash
php artisan optimize:clear
php artisan route:list
php artisan migrate:fresh --seed
```

---

## 17) Risks you should handle early

- Current project has inconsistent role casing in places (`Headmaster` vs `headmaster`)
- Some current endpoints are unprotected; enforce strict middleware in Laravel
- `plain_password` exists in old schema; remove usage ASAP (store only hashed password)
- `student_results` wide-table complexity can slow initial delivery
- Upload path differences can break old image URLs unless mapped carefully

---

## 18) Final recommendation

For a successful full Blade migration:

1. Build **feature parity first** (same screens/workflow).
2. Keep current DB shape initially.
3. Refactor schema only after stable parity release.

If you want, next step I can generate:

- complete `routes/web.php`
- migration files for every table
- starter Blade layouts (`public` + `admin`)
- first 3 controllers (`Home`, `Notice`, `Admin Dashboard`)

as directly runnable Laravel code.
