# Laravel Blade Full Blueprint (Tables + Controllers + Result/Attendance PDF Design)

This document is the **full implementation blueprint** for rebuilding this project in **Laravel + Blade** with feature parity.

It includes:

1. Full module mapping
2. Exact table blueprint (all current tables)
3. Controller blueprint (public + admin + report + import/export)
4. Route blueprint
5. Result PDF + Attendance PDF design blueprint (matching current behavior)
6. Full command checklist

---

## 1) Current project summary (source system)

- Frontend: Next.js (Pages Router) + Tailwind
- Backend: Express (`server.js`) + route/controller/model folders under `Backend/`
- DB: MySQL with raw SQL
- Auth: cookie JWT (`authToken`)
- Uploads: local files in `Backend/uploads`
- Result and report PDFs: generated on frontend using `@react-pdf/renderer`

Tables used in code:

- `users`
- `slider`
- `awards`
- `activities`
- `gallery`
- `board_of_directors`
- `branch`
- `news`
- `notices`
- `classes`
- `sections`
- `students`
- `teacher_sections`
- `attendance`
- `quick_attendance`
- `student_results`
- `subject_config`

---

## 2) Laravel stack to use

## Core

- Laravel 12 (or latest stable)
- Blade templates
- MySQL
- Laravel Breeze (auth)
- Spatie Permission (roles)

## File + import/export + PDF

- `maatwebsite/excel` (Excel import/export)
- `barryvdh/laravel-dompdf` (PDF generation in Laravel)

> Current system uses React-PDF. In Laravel you should shift to server-side Blade-to-PDF.

---

## 3) Full setup commands (run in sequence)

```bash
composer create-project laravel/laravel bhs-laravel
cd bhs-laravel

cp .env.example .env
php artisan key:generate

# Auth scaffold (Blade)
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install
npm run build

# Roles/permissions
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Excel + PDF
composer require maatwebsite/excel
composer require barryvdh/laravel-dompdf

# Storage symlink
php artisan storage:link
```

Generate base app layers:

```bash
# Models + migrations
php artisan make:model Slider -m
php artisan make:model Award -m
php artisan make:model Activity -m
php artisan make:model GalleryItem -m
php artisan make:model Director -m
php artisan make:model Branch -m
php artisan make:model News -m
php artisan make:model Notice -m
php artisan make:model SchoolClass -m
php artisan make:model Section -m
php artisan make:model Student -m
php artisan make:model TeacherSection -m
php artisan make:model Attendance -m
php artisan make:model QuickAttendance -m
php artisan make:model StudentResult -m
php artisan make:model SubjectConfig -m

# Controllers
php artisan make:controller Public/HomeController
php artisan make:controller Public/NoticeController
php artisan make:controller Public/GalleryController
php artisan make:controller Public/TeacherController
php artisan make:controller Public/CommitteeController
php artisan make:controller Public/ResultController

php artisan make:controller Admin/DashboardController
php artisan make:controller Admin/UserController
php artisan make:controller Admin/SliderController
php artisan make:controller Admin/AwardController
php artisan make:controller Admin/GalleryController
php artisan make:controller Admin/DirectorController
php artisan make:controller Admin/ClassController
php artisan make:controller Admin/SectionController
php artisan make:controller Admin/TeacherSectionController
php artisan make:controller Admin/StudentController
php artisan make:controller Admin/AttendanceController
php artisan make:controller Admin/QuickAttendanceController
php artisan make:controller Admin/NoticeController
php artisan make:controller Admin/StudentResultController
php artisan make:controller Admin/SubjectConfigController
php artisan make:controller Admin/ReportController

# Requests
php artisan make:request Auth/LoginRequest
php artisan make:request Admin/StoreUserRequest
php artisan make:request Admin/UpdateUserRequest
php artisan make:request Admin/StoreStudentRequest
php artisan make:request Admin/UpdateStudentRequest
php artisan make:request Admin/StoreAttendanceBulkRequest
php artisan make:request Admin/StoreQuickAttendanceRequest
php artisan make:request Admin/StoreStudentResultRequest
php artisan make:request Admin/UpdateStudentResultRequest
php artisan make:request Admin/StoreSubjectConfigRequest
php artisan make:request Admin/UpdateSubjectConfigRequest

# Services (manual files)
# app/Services/ResultCalculationService.php
# app/Services/Pdf/MarksheetPdfService.php
# app/Services/Pdf/AttendancePdfService.php
# app/Services/Import/StudentExcelImportService.php
# app/Services/Import/StudentResultExcelImportService.php
```

---

## 4) Full database blueprint (all tables)

> Type choices below are safe Laravel defaults; if you already have live schema, match exact production columns.

## 4.1 users

Purpose: Auth users + teacher/headmaster accounts

Columns:

- id (bigint, pk)
- username (string, unique)
- password (string) -> hashed
- full_name (string)
- role (string, nullable) -> keep for compatibility, but primary role management via Spatie
- phone (string, nullable)
- gender (string, nullable)
- expertise (string, nullable)
- address (text, nullable)
- position (string, nullable)
- description (text, nullable)
- plain_password (string, nullable) **legacy only; disable in UI**
- image (string, nullable)
- remember_token
- created_at / updated_at

Indexes:

- unique(username)
- index(role)

## 4.2 slider

- id
- image (string)
- created_at / updated_at

## 4.3 awards

- id
- title (string)
- subtitle (string, nullable)
- image (string)
- created_at / updated_at

## 4.4 activities

- id
- image (string)
- title (string)
- date (string or date, nullable)  # keep compatible with current loose use
- author (string, nullable)
- created_at / updated_at

## 4.5 gallery

- id
- image (string)
- title (string)
- description (longText, nullable)
- category (string, nullable)
- created_at / updated_at

## 4.6 board_of_directors

- id
- image_url (string, nullable)
- name (string)
- position (string)
- details (text)
- description (longText, nullable)
- committee (string)
- created_at / updated_at

## 4.7 branch

- id
- image_url (string, nullable)
- branch_name (string)
- branch_address (text, nullable)
- branch_email (string, nullable)
- branch_incharge (string, nullable)
- branch_phone (string, nullable)
- created_at / updated_at

## 4.8 news

- id
- image (string, nullable)
- title (string)
- description (longText, nullable)
- created_at / updated_at

## 4.9 notices

- id
- title (string)
- date (date)
- content (longText)
- badge (string, nullable)
- created_at / updated_at

Indexes:

- index(date)
- index(title)

## 4.10 classes

- id
- className (string)
- created_at / updated_at

Indexes:

- unique(className)

## 4.11 sections

- id
- sectionName (string)
- classId (unsignedBigInteger fk -> classes.id, cascade delete)
- total_male (unsignedInteger, default 0)
- total_female (unsignedInteger, default 0)
- total_students (unsignedInteger, default 0)
- created_at / updated_at

Indexes:

- index(classId)
- unique(classId, sectionName)

## 4.12 students

- id
- user_id (unsignedBigInteger, nullable fk -> users.id, nullOnDelete)
- section_id (unsignedBigInteger fk -> sections.id, cascade delete)
- name (string)
- phone (string, nullable)
- address (text, nullable)
- position (string, nullable)
- image (string, nullable)
- email (string, nullable)
- gender (string, nullable)
- expertise (string, nullable)
- created_at / updated_at

Indexes:

- index(section_id)
- index(user_id)

## 4.13 teacher_sections

- id
- user_id (unsignedBigInteger fk -> users.id, cascade delete)
- section_id (unsignedBigInteger fk -> sections.id, cascade delete)
- is_primary (boolean default false)
- created_at / updated_at

Indexes:

- unique(user_id, section_id)
- index(user_id)
- index(section_id)

## 4.14 attendance

- id
- student_id (unsignedBigInteger fk -> students.id, cascade delete)
- attendance_date (date)
- status (enum: present, absent, late, excused)
- recorded_by (unsignedBigInteger fk -> users.id, nullOnDelete)
- remarks (text, nullable)
- created_at / updated_at

Indexes:

- unique(student_id, attendance_date)  # required for upsert behavior
- index(attendance_date)
- index(status)

## 4.15 quick_attendance

- id
- section_id (unsignedBigInteger fk -> sections.id, cascade delete)
- attendance_date (date)
- male_count (unsignedInteger, default 0)
- female_count (unsignedInteger, default 0)
- recorded_by (unsignedBigInteger fk -> users.id, nullOnDelete)
- total_male (unsignedInteger, default 0)
- total_female (unsignedInteger, default 0)
- total_students (unsignedInteger, default 0)
- absent_student_ids (text, nullable) # comma-separated ID list (legacy-compatible)
- created_at / updated_at

Indexes:

- unique(section_id, attendance_date)
- index(recorded_by)
- index(attendance_date)

## 4.16 subject_config

- id
- class_level (unsignedTinyInteger)
- group_name (string, nullable) # e.g. Science/Business/Humanities/Common
- subject_key (string)           # e.g. Bangla_1st_CQ
- subject_name (string)          # e.g. Bangla 1st Paper CQ
- compulsory (boolean default true)
- total_marks (unsignedInteger)
- pass_mark (unsignedInteger)
- is_optional (boolean default false)
- created_at / updated_at

Indexes:

- index(class_level)
- index(group_name)
- unique(class_level, group_name, subject_key)

## 4.17 student_results (full wide schema)

Identity and exam metadata:

- id
- student_name (string)
- father_name (string, nullable)
- mother_name (string, nullable)
- guardian_phone (string, nullable)
- roll (unsignedInteger)
- class (string)
- section (string, nullable)
- group_name (string, nullable)
- exam_name (string, nullable)
- year (unsignedSmallInteger)
- session (string, nullable)
- publish_date (date, nullable)
- merit_position (unsignedInteger, nullable)
- gpa (decimal(4,2), nullable)
- failed_subjects (string, nullable)
- remarks (text, nullable)
- total_marks (unsignedInteger, nullable)

Subject columns:

- Bangla_1st_CQ, Bangla_1st_MCQ
- Bangla_2nd_CQ, Bangla_2nd_MCQ
- English_1st_CQ, English_2nd_CQ
- Mathematics_CQ, Mathematics_MCQ
- Science_CQ, Science_MCQ
- Physics_CQ, Physics_MCQ, Physics_Practical
- Chemistry_CQ, Chemistry_MCQ, Chemistry_Practical
- Biology_CQ, Biology_MCQ, Biology_Practical
- HigherMath_CQ, HigherMath_MCQ, HigherMath_Practical
- Accounting_CQ, Accounting_MCQ
- BusinessEnt_CQ, BusinessEnt_MCQ
- Finance_CQ, Finance_MCQ
- History_CQ, History_MCQ
- Civics_CQ, Civics_MCQ
- Geography_CQ, Geography_MCQ, Geography_Practical
- Economics_CQ, Economics_MCQ
- BGS_CQ, BGS_MCQ
- ICT_CQ, ICT_MCQ, ICT_Practical
- Religion_Name (string, nullable), Religion_CQ, Religion_MCQ
- Optional_Subject_Name (string, nullable), Optional_CQ, Optional_MCQ, Optional_Practical
- continuous_assessment
- ArtsCrafts_Assessment
- PhysicalEd_Practical
- PhysicalEd_Assessment
- is_passed (boolean, default false)

Timestamps:

- created_at / updated_at

Recommended numeric types:

- all mark fields -> `unsignedSmallInteger()->nullable()`

Indexes:

- index(class, section, year)
- index(roll)
- index(student_name)
- optional unique guard for duplicates:
  - unique(roll, class, section, year, exam_name)

---

## 5) Migration skeleton commands

After writing migration files:

```bash
php artisan migrate
php artisan migrate:status
```

If rebuilding from scratch:

```bash
php artisan migrate:fresh
```

---

## 6) Eloquent model blueprint

Each model should define:

- `$table` if non-standard (e.g. `board_of_directors`, `classes`)
- `$fillable` with all writable fields
- relationships

Key relationships:

- User hasMany Students (`user_id`)
- User hasMany TeacherSections (`user_id`)
- Student belongsTo Section
- Student belongsTo User
- Section belongsTo SchoolClass (`classId`)
- Section hasMany Students
- TeacherSection belongsTo User + Section
- Attendance belongsTo Student + recorder(User)
- QuickAttendance belongsTo Section + recorder(User)

---

## 7) Controller blueprint (full)

## 7.1 Public controllers

### `Public\HomeController`

- `index()` -> slider, awards, notices, highlights, teachers summary

### `Public\TeacherController`

- `index()` -> list teachers from users by role/position

### `Public\CommitteeController`

- `index(Request $request)` -> directors list, optional committee filter

### `Public\GalleryController`

- `index(Request $request)` -> category-filtered gallery

### `Public\NoticeController`

- `index(Request $request)` -> notice list + pagination/search
- `show(Notice $notice)` -> notice detail

### `Public\ResultController`

- `searchForm()`
- `search(Request $request)` -> by `student_name`, `roll`, `year`
- `groupedSummary()` -> class/section/year grouped blocks

## 7.2 Auth flow controller logic

Use Breeze + extend post-login redirect:

- `headmaster|principal` -> `/admin/dashboard`
- `teacher` -> `/admin/dashboard` (or `/admin/teacher-dashboard`)

## 7.3 Admin controllers

### `Admin\DashboardController`

- `index()` -> class/section/user counts + quick attendance report filter form

### `Admin\UserController` (teacher/headmaster users)

- `index()`
- `create()`, `store()`
- `edit(User $user)`, `update(User $user)`
- `destroy(User $user)`

### `Admin\SliderController`

- `index()`
- `store()`
- `update(Slider $slider)`
- `destroy(Slider $slider)`

### `Admin\AwardController`

- `index()`, `store()`, `update()`, `destroy()`

### `Admin\GalleryController`

- `index()`, `store()`, `update()`, `destroy()`

### `Admin\DirectorController`

- `index()`
- `store()`
- `update(Director $director)`
- `destroy(Director $director)`

### `Admin\ClassController`

- `index()`, `store()`, `update()`, `destroy()`

### `Admin\SectionController`

- `index()`, `store()`, `update()`, `destroy()`

### `Admin\TeacherSectionController`

- `index(Request $request)` -> teacher filtered
- `store()` -> assign section
- `update(TeacherSection $teacherSection)`
- `destroy(TeacherSection $teacherSection)`

### `Admin\StudentController`

- `index(Request $request)` (section filter)
- `create()`, `store()`
- `edit(Student $student)`, `update(Student $student)`
- `destroy(Student $student)`
- `importExcel(Request $request)` # student excel import

### `Admin\AttendanceController` (per-student)

- `index()` -> section + student attendance UI
- `storeBulk(StoreAttendanceBulkRequest $request)`  
  Upsert by `(student_id, attendance_date)`
- `sectionAttendance($sectionId, Request $request)` -> by section/date
- `studentAttendance($studentId, Request $request)` -> by student/date range
- `report(Request $request)` -> section report

### `Admin\QuickAttendanceController`

- `index()` -> list quick entries
- `store(StoreQuickAttendanceRequest $request)` -> prevent duplicate section+date
- `update(QuickAttendance $quickAttendance)`
- `report(Request $request)` -> filters: date/startDate/endDate/sectionId/classId/teacherId

### `Admin\NoticeController`

- `index()`, `store()`, `update()`, `destroy()`
- `search()`, `paginate()`

### `Admin\SubjectConfigController`

- `index()`
- `store()`
- `update(SubjectConfig $subjectConfig)`
- `destroy(SubjectConfig $subjectConfig)`
- `byClass($classLevel)`
- `byClassAndGroup($classLevel, $groupName)`

### `Admin\StudentResultController`

- `index(Request $request)` (list + filters)
- `store(StoreStudentResultRequest $request)`
- `update(StudentResult $studentResult, UpdateStudentResultRequest $request)`
- `destroy(StudentResult $studentResult)`
- `search(Request $request)` (flexible public style)
- `strictSearch(Request $request)` (exact search)
- `groupedSummary()`
- `bulkDelete(Request $request)`
- `uploadExcel(Request $request)` # results excel import
- `downloadMarksheet(StudentResult $studentResult)` # PDF

### `Admin\ReportController`

- `tabulation(Request $request)` data
- `meritList(Request $request)` data
- `failList(Request $request)` data
- `downloadTabulationPdf(Request $request)`
- `downloadMeritPdf(Request $request)`
- `downloadFailPdf(Request $request)`
- `exportTabulationExcel(Request $request)`

---

## 8) Validation rule blueprint (important)

## Attendance bulk

- `attendance_data` required array
- each row:
  - `student_id` exists:students,id
  - `attendance_date` date
  - `status` in:present,absent,late,excused
  - `recorded_by` exists:users,id

## Quick attendance

- `section_id` exists:sections,id
- `attendance_date` date
- `male_count` integer|min:0
- `female_count` integer|min:0
- `total_male` integer|min:0
- `total_female` integer|min:0
- `total_students` integer|min:0
- `recorded_by` exists:users,id
- `absent_student_ids` nullable string

## Student result

- required: `student_name`, `roll`, `class`, `year`
- optional numeric validation for all mark fields
- `is_passed` boolean

## File uploads

- images: `image|mimes:jpg,jpeg,png,gif,webp|max:5120`
- excel: `file|mimes:xlsx,xls|max:20480`

---

## 9) Role and middleware blueprint

Seed roles:

- `headmaster`
- `teacher`
- `principal` (optional)

Use middleware:

- `auth`
- `role:headmaster`
- `role:headmaster|teacher`

Example:

- full CRUD modules (`users/classes/sections/subject-config`) -> headmaster
- attendance + quick attendance + result input -> headmaster|teacher

---

## 10) Route blueprint (web)

Example `routes/web.php` layout:

```php
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\TeacherController;
use App\Http\Controllers\Public\CommitteeController;
use App\Http\Controllers\Public\GalleryController as PublicGalleryController;
use App\Http\Controllers\Public\NoticeController as PublicNoticeController;
use App\Http\Controllers\Public\ResultController;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\AwardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\DirectorController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\TeacherSectionController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\QuickAttendanceController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\StudentResultController;
use App\Http\Controllers\Admin\SubjectConfigController;
use App\Http\Controllers\Admin\ReportController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/teachers-and-staff', [TeacherController::class, 'index'])->name('public.teachers.index');
Route::get('/committee-members', [CommitteeController::class, 'index'])->name('public.committee.index');
Route::get('/gallery', [PublicGalleryController::class, 'index'])->name('public.gallery.index');
Route::get('/notice', [PublicNoticeController::class, 'index'])->name('public.notice.index');
Route::get('/notice/{notice}', [PublicNoticeController::class, 'show'])->name('public.notice.show');
Route::get('/student-result', [ResultController::class, 'searchForm'])->name('public.result.form');
Route::get('/student-result/search', [ResultController::class, 'search'])->name('public.result.search');

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:headmaster')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('sliders', SliderController::class)->except(['show', 'create', 'edit']);
        Route::resource('awards', AwardController::class)->except(['show', 'create', 'edit']);
        Route::resource('gallery', GalleryController::class)->except(['show', 'create', 'edit']);
        Route::resource('directors', DirectorController::class)->except(['show', 'create', 'edit']);
        Route::resource('classes', ClassController::class)->except(['show', 'create', 'edit']);
        Route::resource('sections', SectionController::class)->except(['show', 'create', 'edit']);
        Route::resource('teacher-sections', TeacherSectionController::class)->except(['show', 'create', 'edit']);
        Route::resource('subject-config', SubjectConfigController::class)->except(['show', 'create', 'edit']);
        Route::resource('notices', NoticeController::class)->except(['show', 'create', 'edit']);
    });

    Route::middleware('role:headmaster|teacher')->group(function () {
        Route::resource('students', StudentController::class)->except(['show']);
        Route::post('students/import-excel', [StudentController::class, 'importExcel'])->name('students.import');

        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance/bulk', [AttendanceController::class, 'storeBulk'])->name('attendance.bulk');
        Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');

        Route::resource('quick-attendance', QuickAttendanceController::class)->only(['index', 'store', 'update']);
        Route::get('quick-attendance/report', [QuickAttendanceController::class, 'report'])->name('quick-attendance.report');

        Route::resource('student-results', StudentResultController::class)->except(['create', 'edit', 'show']);
        Route::post('student-results/upload-excel', [StudentResultController::class, 'uploadExcel'])->name('student-results.upload');
        Route::post('student-results/bulk-delete', [StudentResultController::class, 'bulkDelete'])->name('student-results.bulk-delete');
        Route::get('student-results/{studentResult}/marksheet-pdf', [StudentResultController::class, 'downloadMarksheet'])->name('student-results.marksheet-pdf');
    });

    Route::middleware('role:headmaster|teacher')->prefix('reports')->name('reports.')->group(function () {
        Route::get('/tabulation', [ReportController::class, 'tabulation'])->name('tabulation');
        Route::get('/merit-list', [ReportController::class, 'meritList'])->name('merit');
        Route::get('/fail-list', [ReportController::class, 'failList'])->name('fail');
        Route::get('/tabulation/pdf', [ReportController::class, 'downloadTabulationPdf'])->name('tabulation.pdf');
        Route::get('/merit-list/pdf', [ReportController::class, 'downloadMeritPdf'])->name('merit.pdf');
        Route::get('/fail-list/pdf', [ReportController::class, 'downloadFailPdf'])->name('fail.pdf');
    });
});
```

---

## 11) PDF blueprint: Result Marksheet (exact behavior spec)

Source parity target: current `utility/marksheet.js`.

## 11.1 Format and branding

- Page: A4 portrait
- Font: Bangla-compatible (`Anek Bangla`)
- Header:
  - school logo left
  - school name, established year, address, email/mobile center
  - school code + EIIN
- Right top box: grading scale table:
  - A+ 80-100 -> 5.0
  - A 70-79 -> 4.0
  - A- 60-69 -> 3.5
  - B 50-59 -> 3.0
  - C 40-49 -> 2.0
  - D 33-39 -> 1.0
  - F 0-32 -> 0.0

## 11.2 Student information block

Show:

- Name
- Father's Name
- Mother's Name
- Guardian Phone
- Session
- Roll
- Class
- Section
- Group
- Year
- Exam name

## 11.3 Subject table

Columns:

- SL
- Subject
- CQ
- MCQ
- Practical
- Total
- Grade
- GPA

Build rows from `subject_config` by `class_level` + optional `group_name`.

Special mapping rules:

- Religion uses: `Religion_Name`, `Religion_CQ`, `Religion_MCQ`
- Optional uses: `Optional_Subject_Name`, `Optional_CQ`, `Optional_MCQ`, `Optional_Practical`
- Assessment-style fields (ArtsCrafts/PhysicalEd) include practical/assessment mark behavior

## 11.4 Result calculation rules

- Calculate subject total from available CQ/MCQ/Practical
- Pass if `total >= pass_mark`
- Subject grade by percentage
- Fail subject list = all subjects where pass false
- Final GPA = average GPA of eligible subjects (or business rule from your existing calculator)
- Overall result:
  - if any required subject failed -> Fail
  - else Pass

## 11.5 Footer

- Total marks, GPA, final grade
- Failed subjects list box (if any)
- signature lines:
  - Guardian
  - Class Teacher
  - Principal
- generated date

## 11.6 Laravel implementation files

- `app/Services/ResultCalculationService.php`
- `app/Services/Pdf/MarksheetPdfService.php`
- `resources/views/pdf/marksheet.blade.php`

Example generation:

```php
return Pdf::loadView('pdf.marksheet', $payload)
    ->setPaper('a4', 'portrait')
    ->download("marksheet_{$studentResult->roll}.pdf");
```

---

## 12) PDF blueprint: Attendance Report (exact behavior spec)

Source parity target: current `utility/quickattendencePage.js`.

## 12.1 Format and branding

- Page: A4 portrait
- Same school header style + logo
- Title: Daily Attendance Report with selected date/range

## 12.2 Table structure

Columns:

- Serial
- Class
- Section
- Total Students (sub columns: Male, Female)
- Total Students (combined)
- Present (sub columns: Male, Female)
- Total Present
- Total Absent
- Attendance %

Row calculations:

- `present = male_count + female_count`
- `absent = total_students - present`
- `percentage = present / total_students * 100`

Footer totals row:

- total male students
- total female students
- grand total
- total present male/female
- overall present/absent
- overall percentage

Absent list section:

- display absent ids by class-section
- format: `ClassName-SectionName: 123, 456`

Signatures:

- Class Teacher
- Headmaster

## 12.3 Laravel implementation files

- `app/Services/Pdf/AttendancePdfService.php`
- `resources/views/pdf/attendance-report.blade.php`

Example generation:

```php
return Pdf::loadView('pdf.attendance-report', $payload)
    ->setPaper('a4', 'portrait')
    ->download("attendance_report_{$from}_{$to}.pdf");
```

---

## 13) Tabulation / Merit / Fail report blueprint (admin)

Current app also generates:

- Tabulation Sheet PDF (A3 landscape)
- Merit List PDF
- Fail List PDF

Laravel parity files:

- `resources/views/pdf/tabulation-sheet.blade.php` (A3 landscape)
- `resources/views/pdf/merit-list.blade.php`
- `resources/views/pdf/fail-list.blade.php`

Controller endpoints:

- `ReportController@downloadTabulationPdf`
- `ReportController@downloadMeritPdf`
- `ReportController@downloadFailPdf`
- Excel equivalents via `maatwebsite/excel`

---

## 14) Upload/storage blueprint

Use Laravel public disk:

- Save to `storage/app/public/uploads/...`
- DB value example: `uploads/students/abc.jpg`
- render with `Storage::url($path)`

Folder strategy:

- `uploads/sliders`
- `uploads/awards`
- `uploads/gallery`
- `uploads/directors`
- `uploads/users`
- `uploads/students`
- `uploads/imports`

---

## 15) API compatibility (optional but recommended)

If you want zero frontend break during migration, temporarily keep old API paths in `routes/api.php`:

- `/api/auth/*`
- `/api/slider/*`
- `/api/award/*`
- `/api/gallery/*`
- `/api/director/*`
- `/api/classes/*`
- `/api/sections/*`
- `/api/students/*`
- `/api/teacher-sections/*`
- `/api/attendance/*`
- `/api/quickattendance/*`
- `/api/notices/*`
- `/api/student-results/*`
- `/api/subject-config/*`

Then progressively switch Blade pages to server-rendered routes.

---

## 16) Seeder blueprint

Create:

- `RolePermissionSeeder`
- `AdminUserSeeder`
- `ClassSectionSeeder` (optional)

RolePermissionSeeder minimum:

- roles: `headmaster`, `teacher`, `principal`
- attach default permissions per module

AdminUserSeeder:

- create first headmaster login

---

## 17) Security and cleanup notes

- Keep `plain_password` only as legacy nullable field; do not store new plain passwords
- Enforce CSRF on all forms
- Enforce policy/middleware on all admin actions
- Validate file MIME and size
- Normalize role values to lowercase everywhere

---

## 18) Build order (recommended exact sequence)

1. Auth + roles + admin layout
2. Core tables (`users`, `classes`, `sections`, `students`)
3. Teacher-section + attendance + quick attendance
4. Subject config + student results (wide schema)
5. PDF services (marksheet + attendance + tabulation)
6. Public pages (home, notice, gallery, teachers, committee)
7. Remaining content modules (slider, awards, activities, news, branch)
8. Excel import/export and final QA

---

## 19) Final execution checklist

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan optimize:clear
php artisan route:list
npm run build
php artisan serve
```

---

## 20) Next code generation scope

If you want, next step can be generated directly from this blueprint:

1. All migration files with exact columns/indexes
2. All controller classes with method stubs and validation
3. `routes/web.php` + optional `routes/api.php` compatibility layer
4. `resources/views/pdf/marksheet.blade.php`
5. `resources/views/pdf/attendance-report.blade.php`
6. Result calculation service class with your current grade rules
