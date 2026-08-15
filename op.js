/* =========================================================
   ACADEMIC ANALYZER
   Teacher-side Academic Management System
   Pure JavaScript
   ========================================================= */


/* =========================================================
   DATA
   ========================================================= */

const defaultStudents = [
    {
        id: 1,
        name: "Aarav Sharma",
        roll: "01",
        className: "10-A",
        marks: {
            english: 82,
            maths: 91,
            science: 88,
            sst: 79,
            hindi: 85,
            computer: 94
        }
    },

    {
        id: 2,
        name: "Ananya Singh",
        roll: "02",
        className: "10-A",
        marks: {
            english: 91,
            maths: 88,
            science: 93,
            sst: 90,
            hindi: 89,
            computer: 96
        }
    },

    {
        id: 3,
        name: "Rohan Verma",
        roll: "03",
        className: "10-A",
        marks: {
            english: 68,
            maths: 72,
            science: 65,
            sst: 74,
            hindi: 70,
            computer: 81
        }
    },

    {
        id: 4,
        name: "Priya Gupta",
        roll: "04",
        className: "10-B",
        marks: {
            english: 77,
            maths: 61,
            science: 73,
            sst: 80,
            hindi: 78,
            computer: 85
        }
    }
];


const examTypes = [
    "Unit Test",
    "Midterm",
    "Pre-Final",
    "Final"
];

function emptyMarks() {
    return {
        english: 0,
        maths: 0,
        science: 0,
        sst: 0,
        hindi: 0,
        computer: 0
    };
}

function normalizeExamMarks(student) {
    if (!student.marksByExam) {
        student.marksByExam = {};
        examTypes.forEach(exam => {
            student.marksByExam[exam] = emptyMarks();
        });

        // Existing marks are treated as the student's Final exam marks
        // so older saved data is not lost.
        if (student.marks) {
            student.marksByExam["Final"] = { ...emptyMarks(), ...student.marks };
        }
    } else {
        examTypes.forEach(exam => {
            student.marksByExam[exam] = {
                ...emptyMarks(),
                ...(student.marksByExam[exam] || {})
            };
        });
    }

    if (!student.marks) {
        student.marks = { ...student.marksByExam["Final"] };
    }
}

let students =
    JSON.parse(localStorage.getItem("academicAnalyzerStudents"))
    || defaultStudents;

students.forEach(normalizeExamMarks);


/* =========================================================
   SUBJECTS
   ========================================================= */

const subjects = [
    {
        key: "english",
        name: "English"
    },
    {
        key: "maths",
        name: "Mathematics"
    },
    {
        key: "science",
        name: "Science"
    },
    {
        key: "sst",
        name: "Social Science"
    },
    {
        key: "hindi",
        name: "Hindi"
    },
    {
        key: "computer",
        name: "Computer / AI"
    }
];


/* =========================================================
   DOM
   ========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");


/* =========================================================
   AUTH
   ========================================================= */

const AUTH_USER = "bcspro";
const AUTH_PASS = "bcspro2010";
const AUTH_KEY = "academicAnalyzerLoggedIn";

function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
}

function setLoggedIn(value) {
    if (value) {
        localStorage.setItem(AUTH_KEY, "true");
        document.body.classList.add("logged-in");
    } else {
        localStorage.removeItem(AUTH_KEY);
        document.body.classList.remove("logged-in");
    }
}

function setupAuth() {
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isLoggedIn()) {
        setLoggedIn(true);
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (username === AUTH_USER && password === AUTH_PASS) {
            loginError.classList.add("hidden");
            loginError.textContent = "";
            setLoggedIn(true);
            document.getElementById("loginForm").reset();
            updateAll();
            drawChart();
        } else {
            loginError.textContent = "Invalid username or password.";
            loginError.classList.remove("hidden");
        }
    });

    logoutBtn.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        setLoggedIn(false);
        document.getElementById("loginForm").reset();
        loginError.classList.add("hidden");
        loginError.textContent = "";
    });
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupAuth();

    setCurrentDate();

    setupNavigation();

    setupStudentModal();

    setupMarksForm();

    setupSearch();

    setupReport();

    setupTimetable();

    setupClearData();

    if (isLoggedIn()) {
        updateAll();
    }

});


/* =========================================================
   DATE
   ========================================================= */

function setCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    navItems.forEach(button => {

        button.addEventListener("click", () => {

            const page =
                button.dataset.page;

            openPage(page);

        });

    });


    document
        .querySelectorAll("[data-page-target]")
        .forEach(button => {

            button.addEventListener("click", () => {

                openPage(
                    button.dataset.pageTarget
                );

            });

        });


    document
        .getElementById("mobileMenu")
        .addEventListener("click", () => {

            document
                .querySelector(".sidebar")
                .classList.toggle("mobile-open");

        });

}


function openPage(page) {

    pages.forEach(section => {

        section.classList.remove("active-page");

    });


    const selectedPage =
        document.getElementById(page + "Page");

    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    navItems.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === page) {

            button.classList.add("active");

        }

    });


    const titles = {

        dashboard: [
            "Teacher Dashboard",
            "Monitor and analyze your students' academic performance."
        ],

        students: [
            "Students",
            "Manage your students and their academic records."
        ],

        marks: [
            "Enter Marks",
            "Add or update marks for a student."
        ],

        analysis: [
            "Performance Analysis",
            "Identify strengths, weaknesses and academic trends."
        ],

        reports: [
            "Reports",
            "Generate a student academic report."
        ],

        timetable: [
            "Teacher Timetable",
            "View your teaching schedule according to different days."
        ]

    };


    if (titles[page]) {

        pageTitle.textContent =
            titles[page][0];

        pageSubtitle.textContent =
            titles[page][1];

    }


    document
        .querySelector(".sidebar")
        .classList.remove("mobile-open");


    if (page === "analysis") {

        renderAnalysis();

    }

    if (page === "reports") {

        populateReportStudents();

    }

}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveData() {

    localStorage.setItem(
        "academicAnalyzerStudents",
        JSON.stringify(students)
    );

}


/* =========================================================
   CALCULATIONS
   ========================================================= */

function getAverage(student) {

    const values =
        subjects.map(
            subject =>
                Number(student.marks[subject.key]) || 0
        );

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );

    return total / subjects.length;

}


function getTotal(student) {

    return subjects.reduce(
        (total, subject) => {

            return total +
                (Number(student.marks[subject.key]) || 0);

        },
        0
    );

}


function getPerformance(average) {

    if (average >= 85) {

        return {
            name: "Excellent",
            className: "excellent"
        };

    }

    if (average >= 70) {

        return {
            name: "Good",
            className: "good"
        };

    }

    if (average >= 50) {

        return {
            name: "Average",
            className: "average"
        };

    }

    return {
        name: "Needs Improvement",
        className: "weak"
    };

}


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAll() {

    updateDashboard();

    renderStudents();

    populateMarksStudents();

    populateReportStudents();

    renderAnalysis();

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


    const classAverage =
        students.length
            ? students.reduce(
                (sum, student) =>
                    sum + getAverage(student),
                0
            ) / students.length
            : 0;


    document.getElementById(
        "classAverage"
    ).textContent =
        classAverage.toFixed(1) + "%";


    const sorted =
        [...students].sort(
            (a, b) =>
                getAverage(b) -
                getAverage(a)
        );


    document.getElementById(
        "topPerformer"
    ).textContent =
        sorted.length
            ? sorted[0].name
            : "—";


    const attention =
        students.filter(
            student =>
                getAverage(student) < 50
        ).length;


    document.getElementById(
        "needsAttention"
    ).textContent = attention;


    updateDistribution();

    renderDashboardTable();

    drawChart();

}


/* =========================================================
   DISTRIBUTION
   ========================================================= */

function updateDistribution() {

    let excellent = 0;
    let good = 0;
    let average = 0;
    let weak = 0;


    students.forEach(student => {

        const avg =
            getAverage(student);


        if (avg >= 85) {

            excellent++;

        } else if (avg >= 70) {

            good++;

        } else if (avg >= 50) {

            average++;

        } else {

            weak++;

        }

    });


    document.getElementById(
        "excellentCount"
    ).textContent = excellent;


    document.getElementById(
        "goodCount"
    ).textContent = good;


    document.getElementById(
        "averageCount"
    ).textContent = average;


    document.getElementById(
        "weakCount"
    ).textContent = weak;

}


/* =========================================================
   DASHBOARD TABLE
   ========================================================= */

function renderDashboardTable() {

    const tbody =
        document.getElementById(
            "dashboardStudentTable"
        );


    tbody.innerHTML = "";


    students
        .slice(-5)
        .reverse()
        .forEach(student => {

            const average =
                getAverage(student);

            const performance =
                getPerformance(average);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <span class="student-name">
                        ${escapeHTML(student.name)}
                    </span>
                </td>

                <td>
                    ${student.className}
                </td>

                <td>
                    <strong>
                        ${average.toFixed(1)}%
                    </strong>
                </td>

                <td>
                    <span class="badge ${performance.className}">
                        ${performance.name}
                    </span>
                </td>

            `;


            tbody.appendChild(row);

        });


    if (!students.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No students added yet.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   STUDENTS TABLE
   ========================================================= */

function renderStudents() {

    const tbody =
        document.getElementById(
            "studentsTable"
        );


    const search =
        (
            document.getElementById(
                "studentSearch"
            )?.value || ""
        ).toLowerCase();


    const classFilter =
        document.getElementById(
            "classFilter"
        )?.value || "all";


    tbody.innerHTML = "";


    const filtered =
        students.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search)
                ||
                student.roll
                    .toLowerCase()
                    .includes(search);


            const matchesClass =
                classFilter === "all"
                ||
                student.className === classFilter;


            return matchesSearch &&
                matchesClass;

        });


    filtered.forEach(student => {

        const average =
            getAverage(student);

        const performance =
            getPerformance(average);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.roll}</td>

            <td>
                <span class="student-name">
                    ${escapeHTML(student.name)}
                </span>
            </td>

            <td>${student.className}</td>

            <td>
                <strong>
                    ${average.toFixed(1)}%
                </strong>
            </td>

            <td>
                <span class="badge ${performance.className}">
                    ${performance.name}
                </span>
            </td>

            <td>

                <button
                    class="action-button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });


    if (!filtered.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    document
        .getElementById("studentSearch")
        .addEventListener(
            "input",
            renderStudents
        );


    document
        .getElementById("classFilter")
        .addEventListener(
            "change",
            renderStudents
        );

}


/* =========================================================
   ADD STUDENT MODAL
   ========================================================= */

function setupStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    document
        .getElementById("addStudentBtn")
        .addEventListener(
            "click",
            () => {

                modal.classList.add("show");

            }
        );


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeStudentModal
        );


    document
        .getElementById("cancelStudent")
        .addEventListener(
            "click",
            closeStudentModal
        );


    document
        .getElementById("studentForm")
        .addEventListener(
            "submit",
            addStudent
        );

}


function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("show");


    document
        .getElementById("studentForm")
        .reset();

}


/* =========================================================
   ADD STUDENT
   ========================================================= */

function addStudent(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("studentName")
            .value
            .trim();


    const roll =
        document
            .getElementById("rollNumber")
            .value
            .trim();


    const className =
        document
            .getElementById("studentClass")
            .value;


    if (!name || !roll || !className) {

        alert("Please fill all fields.");

        return;

    }


    const student = {

        id: Date.now(),

        name,

        roll,

        className,

        marks: {
            english: 0,
            maths: 0,
            science: 0,
            sst: 0,
            hindi: 0,
            computer: 0
        }

    };


    students.push(student);

    saveData();

    closeStudentModal();

    updateAll();


    alert(
        `${name} has been added successfully.`
    );

}


/* =========================================================
   DELETE STUDENT
   ========================================================= */

function deleteStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );


    if (!student) return;


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) return;


    students =
        students.filter(
            item => item.id !== id
        );


    saveData();

    updateAll();

}


/* =========================================================
   EDIT STUDENT
   ========================================================= */

function editStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );


    if (!student) return;


    const newName =
        prompt(
            "Enter student name:",
            student.name
        );


    if (newName === null) return;


    const newRoll =
        prompt(
            "Enter roll number:",
            student.roll
        );


    if (newRoll === null) return;


    student.name =
        newName.trim() || student.name;


    student.roll =
        newRoll.trim() || student.roll;


    saveData();

    updateAll();

}


/* =========================================================
   MARKS FORM
   ========================================================= */

function setupMarksForm() {

    const inputs = [
        "english",
        "maths",
        "science",
        "sst",
        "hindi",
        "computer"
    ];


    inputs.forEach(id => {

        document
            .getElementById(id)
            .addEventListener(
                "input",
                updateLiveMarks
            );

    });


    document
        .getElementById("marksStudent")
        .addEventListener(
            "change",
            loadStudentMarks
        );


    document
        .getElementById("examType")
        .addEventListener(
            "change",
            loadStudentMarks
        );


    document
        .getElementById("saveMarks")
        .addEventListener(
            "click",
            saveMarks
        );


    document
        .getElementById("resetMarks")
        .addEventListener(
            "click",
            resetMarks
        );

}


/* =========================================================
   POPULATE MARKS STUDENTS
   ========================================================= */

function populateMarksStudents() {

    const select =
        document.getElementById(
            "marksStudent"
        );


    const current =
        select.value;


    select.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;


    students.forEach(student => {

        const option =
            document.createElement("option");


        option.value = student.id;

        option.textContent =
            `${student.roll} — ${student.name}`;


        select.appendChild(option);

    });


    if (students.some(
        student =>
            String(student.id) === current
    )) {

        select.value = current;

    }

}


/* =========================================================
   LOAD STUDENT MARKS
   ========================================================= */

function loadStudentMarks() {

    const id =
        Number(
            document.getElementById(
                "marksStudent"
            ).value
        );


    if (!id) {

        resetMarksInputs();

        return;

    }


    const student =
        students.find(
            item => item.id === id
        );


    if (!student) return;


    normalizeExamMarks(student);

    const examType =
        document.getElementById("examType").value || "Unit Test";

    const examMarks =
        student.marksByExam[examType] || emptyMarks();

    subjects.forEach(subject => {

        document.getElementById(
            subject.key
        ).value =
            examMarks[subject.key] || 0;

    });


    updateLiveMarks();

}


/* =========================================================
   LIVE MARKS
   ========================================================= */

function updateLiveMarks() {

    let total = 0;


    subjects.forEach(subject => {

        let value =
            Number(
                document.getElementById(
                    subject.key
                ).value
            ) || 0;


        value =
            Math.max(
                0,
                Math.min(100, value)
            );


        total += value;

    });


    const average =
        total / subjects.length;


    document.getElementById(
        "liveTotal"
    ).textContent =
        `${total} / 600`;


    document.getElementById(
        "liveAverage"
    ).textContent =
        `${average.toFixed(1)}%`;

}


/* =========================================================
   SAVE MARKS
   ========================================================= */

function saveMarks() {

    const id =
        Number(
            document.getElementById(
                "marksStudent"
            ).value
        );


    if (!id) {

        alert("Please select a student.");

        return;

    }


    const student =
        students.find(
            item => item.id === id
        );


    if (!student) return;


    normalizeExamMarks(student);

    const examType =
        document.getElementById("examType").value || "Unit Test";

    const examMarks = emptyMarks();

    subjects.forEach(subject => {

        let value =
            Number(
                document.getElementById(
                    subject.key
                ).value
            ) || 0;


        value =
            Math.max(
                0,
                Math.min(100, value)
            );


        examMarks[subject.key] = value;

    });

    student.marksByExam[examType] = examMarks;

    // Keep the existing dashboard/student records based on Final marks.
    if (examType === "Final") {
        student.marks = { ...examMarks };
    }


    saveData();

    updateAll();


    alert(
        `Marks saved for ${student.name}.`
    );

}


/* =========================================================
   RESET MARKS
   ========================================================= */

function resetMarks() {

    resetMarksInputs();

}


function resetMarksInputs() {

    subjects.forEach(subject => {

        document.getElementById(
            subject.key
        ).value = "";

    });


    document.getElementById(
        "liveTotal"
    ).textContent = "0 / 600";


    document.getElementById(
        "liveAverage"
    ).textContent = "0%";

}


/* =========================================================
   ANALYSIS
   ========================================================= */

function renderAnalysis() {

    renderSubjectAnalysis();

    renderInsights();

    renderRanking();

}


/* =========================================================
   SUBJECT ANALYSIS
   ========================================================= */

function getSubjectAverage(key) {

    if (!students.length) return 0;


    const total =
        students.reduce(
            (sum, student) => {

                return sum +
                    (
                        Number(
                            student.marks[key]
                        ) || 0
                    );

            },
            0
        );


    return total / students.length;

}


function renderSubjectAnalysis() {

    const container =
        document.getElementById(
            "subjectAnalysis"
        );


    container.innerHTML = "";


    subjects.forEach(subject => {

        const average =
            getSubjectAverage(
                subject.key
            );


        const item =
            document.createElement("div");


        item.className =
            "subject-analysis-item";


        item.innerHTML = `

            <div class="subject-analysis-top">

                <span>
                    ${subject.name}
                </span>

                <strong>
                    ${average.toFixed(1)}%
                </strong>

            </div>

            <div class="progress">

                <div
                    class="progress-bar"
                    style="width: ${average}%"
                ></div>

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   INSIGHTS
   ========================================================= */

function renderInsights() {

    const container =
        document.getElementById(
            "insights"
        );


    container.innerHTML = "";


    if (!students.length) {

        container.innerHTML = `
            <div class="insight">
                <strong>No Data</strong>
                Add students and marks to generate insights.
            </div>
        `;

        return;

    }


    const subjectAverages =
        subjects.map(subject => ({

            ...subject,

            average:
                getSubjectAverage(
                    subject.key
                )

        }));


    const strongest =
        [...subjectAverages].sort(
            (a, b) =>
                b.average - a.average
        )[0];


    const weakest =
        [...subjectAverages].sort(
            (a, b) =>
                a.average - b.average
        )[0];


    const classAverage =
        students.reduce(
            (sum, student) =>
                sum + getAverage(student),
            0
        ) / students.length;


    addInsight(
        container,
        "💪 Strongest Subject",
        `${strongest.name} has the highest class average at ${strongest.average.toFixed(1)}%.`
    );


    addInsight(
        container,
        "⚠ Subject Needing Attention",
        `${weakest.name} has the lowest class average at ${weakest.average.toFixed(1)}%.`
    );


    addInsight(
        container,
        "📊 Overall Performance",
        `The current class average is ${classAverage.toFixed(1)}%.`
    );


    const weakStudents =
        students.filter(
            student =>
                getAverage(student) < 50
        ).length;


    addInsight(
        container,
        "👨‍🎓 Students Needing Support",
        `${weakStudents} student${weakStudents === 1 ? "" : "s"} currently need additional academic support.`
    );

}


function addInsight(
    container,
    title,
    text
) {

    const div =
        document.createElement("div");


    div.className = "insight";


    div.innerHTML = `
        <strong>${title}</strong>
        ${text}
    `;


    container.appendChild(div);

}


/* =========================================================
   RANKING
   ========================================================= */

function renderRanking() {

    const tbody =
        document.getElementById(
            "rankingTable"
        );


    tbody.innerHTML = "";


    const ranked =
        [...students].sort(
            (a, b) =>
                getAverage(b) -
                getAverage(a)
        );


    ranked.forEach(
        (student, index) => {

            const average =
                getAverage(student);


            const performance =
                getPerformance(
                    average
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        #${index + 1}
                    </strong>
                </td>

                <td>
                    <span class="student-name">
                        ${escapeHTML(student.name)}
                    </span>
                </td>

                <td>
                    ${student.className}
                </td>

                <td>
                    ${average.toFixed(1)}%
                </td>

                <td>
                    <span class="badge ${performance.className}">
                        ${performance.name}
                    </span>
                </td>

            `;


            tbody.appendChild(row);

        }
    );


    if (!ranked.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No student data available.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   SIMPLE CANVAS CHART
   ========================================================= */

function drawChart() {

    const canvas = document.getElementById("subjectChart");
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    const isMobile = width <= 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const values = subjects.map(subject => getSubjectAverage(subject.key));
    const max = 100;

    /* MOBILE: compact horizontal progress bars */
    if (isMobile) {
        const left = 82;
        const right = 42;
        const top = 8;
        const rowHeight = 31;
        const barHeight = 7;
        const barWidth = Math.max(width - left - right, 100);

        values.forEach((value, index) => {
            const y = top + index * rowHeight + 8;
            const label = subjects[index].name;
            const displayLabel = label.length > 15 ? label.substring(0, 14) + "…" : label;

            ctx.fillStyle = "#374151";
            ctx.font = "10px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(displayLabel, left - 10, y + barHeight / 2);

            ctx.fillStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.roundRect(left, y, barWidth, barHeight, 4);
            ctx.fill();

            const filledWidth = (Math.max(0, Math.min(value, max)) / max) * barWidth;
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.roundRect(left, y, filledWidth, barHeight, 4);
            ctx.fill();

            ctx.fillStyle = "#374151";
            ctx.font = "600 10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(value.toFixed(1) + "%", left + barWidth + 8, y + barHeight / 2);
        });

        return;
    }

    /* DESKTOP / LAPTOP: original vertical bar chart */
    const left = 50;
    const right = 20;
    const top = 20;
    const bottom = 45;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let value = 0; value <= 100; value += 20) {
        const y = top + chartHeight - (value / max) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
        ctx.stroke();
        ctx.fillStyle = "#6b7280";
        ctx.font = "11px Arial";
        ctx.textAlign = "left";
        ctx.fillText(value, 15, y + 4);
    }

    const barGap = 18;
    const barWidth = (chartWidth - barGap * (values.length - 1)) / values.length;

    values.forEach((value, index) => {
        const barHeight = (value / max) * chartHeight;
        const x = left + index * (barWidth + barGap);
        const y = top + chartHeight - barHeight;

        ctx.fillStyle = "#4f46e5";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 5);
        ctx.fill();

        ctx.fillStyle = "#374151";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.fillText(value.toFixed(0) + "%", x + barWidth / 2, y - 7);

        ctx.fillStyle = "#6b7280";
        ctx.font = "10px Arial";
        const label = subjects[index].name;
        ctx.fillText(label.length > 12 ? label.substring(0, 11) + "…" : label, x + barWidth / 2, height - 15);
    });
}



/* =========================================================
   REPORTS
   ========================================================= */

function setupReport() {

    document
        .getElementById("reportStudent")
        .addEventListener(
            "change",
            generateReport
        );


    document
        .getElementById("reportExam")
        .addEventListener(
            "change",
            generateReport
        );


    document
        .getElementById("printReport")
        .addEventListener(
            "click",
            () => {

                window.print();

            }
        );

}


function populateReportStudents() {

    const select =
        document.getElementById(
            "reportStudent"
        );


    const current =
        select.value;


    select.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;


    students.forEach(student => {

        const option =
            document.createElement("option");


        option.value =
            student.id;


        option.textContent =
            `${student.roll} — ${student.name}`;


        select.appendChild(option);

    });


    if (
        students.some(
            student =>
                String(student.id) === current
        )
    ) {

        select.value = current;

    }

}


function generateReport() {

    const id =
        Number(
            document.getElementById(
                "reportStudent"
            ).value
        );


    const report =
        document.getElementById(
            "reportContent"
        );


    if (!id) {

        report.classList.add("hidden");

        return;

    }


    const student =
        students.find(
            item => item.id === id
        );


    if (!student) return;


    normalizeExamMarks(student);

    const examType =
        document.getElementById("reportExam").value || "Unit Test";

    const marks =
        student.marksByExam[examType] || emptyMarks();


    report.classList.remove("hidden");


    const values = subjects.map(subject =>
        Number(marks[subject.key]) || 0
    );

    const average =
        values.reduce((sum, value) => sum + value, 0) / subjects.length;


    document.getElementById("reportName").textContent = student.name;

    document.getElementById("reportClass").textContent =
        `Roll No. ${student.roll} • Class ${student.className}`;

    document.getElementById("reportExamName").textContent = examType;

    document.getElementById("reportAverage").textContent =
        average.toFixed(1) + "%";

    document.getElementById("reportEnglish").textContent = marks.english;
    document.getElementById("reportMaths").textContent = marks.maths;
    document.getElementById("reportScience").textContent = marks.science;
    document.getElementById("reportSST").textContent = marks.sst;
    document.getElementById("reportHindi").textContent = marks.hindi;
    document.getElementById("reportComputer").textContent = marks.computer;

    document.getElementById("reportInsight").textContent =
        generateExamInsight(student, examType, marks);

    drawReportChart(student, examType);
    drawExamProgressChart(student);

}


function generateExamInsight(student, examType, marks) {

    const entries = subjects.map(subject => ({
        name: subject.name,
        value: Number(marks[subject.key]) || 0
    }));

    const strongest = entries.reduce((a, b) => a.value >= b.value ? a : b);
    const weakest = entries.reduce((a, b) => a.value <= b.value ? a : b);

    const average =
        entries.reduce((sum, item) => sum + item.value, 0) / entries.length;

    return `${examType}: ${student.name} scored an average of ${average.toFixed(1)}%. Strongest subject: ${strongest.name} (${strongest.value}). Focus area: ${weakest.name} (${weakest.value}).`;

}


function drawReportChart(student, examType) {


    const canvas = document.getElementById("reportSubjectChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(rect.width, 300);
    const height = width <= 600 ? 210 : 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    normalizeExamMarks(student);
    const marks = student.marksByExam[examType] || emptyMarks();

    const data = [
        ["English", marks.english],
        ["Maths", marks.maths],
        ["Science", marks.science],
        ["SST", marks.sst],
        ["Hindi", marks.hindi],
        ["Computer", marks.computer]
    ];

    /* MOBILE: compact horizontal progress bars */
    if (width <= 600) {
        const left = 82;
        const right = 42;
        const top = 8;
        const rowHeight = 31;
        const barHeight = 7;
        const barWidth = Math.max(width - left - right, 100);

        data.forEach(([label, value], index) => {
            const y = top + index * rowHeight + 8;

            ctx.fillStyle = "#374151";
            ctx.font = "10px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(label, left - 10, y + barHeight / 2);

            ctx.fillStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.roundRect(left, y, barWidth, barHeight, 4);
            ctx.fill();

            const filledWidth = (Math.max(0, Math.min(value, 100)) / 100) * barWidth;
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.roundRect(left, y, filledWidth, barHeight, 4);
            ctx.fill();

            ctx.fillStyle = "#374151";
            ctx.font = "600 10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(Number(value).toFixed(1) + "%", left + barWidth + 8, y + barHeight / 2);
        });

        return;
    }

    const left = 42;
    const right = 18;
    const top = 18;
    const bottom = 48;
    const chartW = width - left - right;
    const chartH = height - top - bottom;
    const step = chartW / data.length;
    const barW = Math.min(42, step * 0.55);

    ctx.strokeStyle = "#e5e7eb";
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.textAlign = "right";

    for (let value = 0; value <= 100; value += 20) {
        const y = top + chartH - (value / 100) * chartH;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
        ctx.stroke();
        ctx.fillText(value, left - 8, y + 4);
    }

    data.forEach(([label, value], index) => {
        const x = left + step * index + (step - barW) / 2;
        const barH = (value / 100) * chartH;
        const y = top + chartH - barH;

        ctx.fillStyle = "#4f46e5";
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 6);
        ctx.fill();

        ctx.fillStyle = "#111827";
        ctx.font = "600 11px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(value, x + barW / 2, Math.max(y - 7, 12));

        ctx.fillStyle = "#6b7280";
        ctx.font = "11px Segoe UI, sans-serif";
        ctx.fillText(label, x + barW / 2, height - 18);
    });

}


function drawExamProgressChart(student) {

    const canvas = document.getElementById("reportExamChart");
    if (!canvas) return;

    normalizeExamMarks(student);

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(rect.width, 1);
    const height = width <= 600 ? 210 : 260;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const data = examTypes.map(exam => {
        const marks = student.marksByExam[exam] || emptyMarks();
        const average = subjects.reduce(
            (sum, subject) => sum + (Number(marks[subject.key]) || 0),
            0
        ) / subjects.length;
        return [exam, average];
    });

    /* MOBILE: compact horizontal progress bars, matching the phone UI */
    if (width <= 600) {
        const left = 78;
        const right = 46;
        const top = 8;
        const rowHeight = 45;
        const barHeight = 7;
        const barWidth = Math.max(width - left - right, 80);

        data.forEach(([label, value], index) => {
            const y = top + index * rowHeight + 8;

            ctx.fillStyle = "#374151";
            ctx.font = "10px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(label, left - 10, y + barHeight / 2);

            ctx.fillStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.roundRect(left, y, barWidth, barHeight, 4);
            ctx.fill();

            const filledWidth = (Math.max(0, Math.min(value, 100)) / 100) * barWidth;
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.roundRect(left, y, filledWidth, barHeight, 4);
            ctx.fill();

            ctx.fillStyle = "#374151";
            ctx.font = "600 10px Arial";
            ctx.textAlign = "left";
            ctx.fillText(Number(value).toFixed(1) + "%", left + barWidth + 8, y + barHeight / 2);
        });

        return;
    }

    const left = 42;
    const right = 18;
    const top = 18;
    const bottom = 48;
    const chartW = width - left - right;
    const chartH = height - top - bottom;
    const step = chartW / data.length;
    const barW = Math.min(70, step * 0.55);

    ctx.strokeStyle = "#e5e7eb";
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.textAlign = "right";

    for (let value = 0; value <= 100; value += 20) {
        const y = top + chartH - (value / 100) * chartH;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
        ctx.stroke();
        ctx.fillText(value, left - 8, y + 4);
    }

    data.forEach(([label, value], index) => {
        const x = left + step * index + (step - barW) / 2;
        const barH = (value / 100) * chartH;
        const y = top + chartH - barH;

        ctx.fillStyle = "#4f46e5";
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 6);
        ctx.fill();

        ctx.fillStyle = "#111827";
        ctx.font = "600 11px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(value.toFixed(1) + "%", x + barW / 2, Math.max(y - 7, 12));

        ctx.fillStyle = "#6b7280";
        ctx.font = "11px Segoe UI, sans-serif";
        ctx.fillText(label, x + barW / 2, height - 18);
    });

}


function generateStudentInsight(student) {

    const average =
        getAverage(student);


    const strongest =
        [...subjects].sort(
            (a, b) =>
                student.marks[b.key] -
                student.marks[a.key]
        )[0];


    const weakest =
        [...subjects].sort(
            (a, b) =>
                student.marks[a.key] -
                student.marks[b.key]
        )[0];


    let level;


    if (average >= 85) {

        level =
            "The student is performing excellently and is consistently demonstrating strong academic performance.";

    } else if (average >= 70) {

        level =
            "The student is performing well, with a good overall academic standing.";

    } else if (average >= 50) {

        level =
            "The student has an average performance and should focus on improving weaker subjects.";

    } else {

        level =
            "The student requires additional academic support and focused attention.";

    }


    return `${level} Strongest subject: ${strongest.name} (${student.marks[strongest.key]}%). Subject requiring the most improvement: ${weakest.name} (${student.marks[weakest.key]}%).`;

}


/* =========================================================
   TEACHER TIMETABLE
   ========================================================= */

const teacherTimetable = {
    Monday: [
        ["1", "8:00 - 8:45", "Mathematics", "10-A", "Room 101"],
        ["2", "8:45 - 9:30", "Science", "10-B", "Lab 1"],
        ["3", "9:30 - 10:15", "Mathematics", "11-A", "Room 203"],
        ["4", "10:30 - 11:15", "Computer / AI", "12-A", "Computer Lab"],
        ["5", "11:15 - 12:00", "Mathematics", "10-A", "Room 101"]
    ],
    Tuesday: [
        ["1", "8:00 - 8:45", "Science", "10-A", "Lab 1"],
        ["2", "8:45 - 9:30", "Mathematics", "12-A", "Room 204"],
        ["3", "9:30 - 10:15", "Computer / AI", "11-B", "Computer Lab"],
        ["4", "10:30 - 11:15", "Mathematics", "10-B", "Room 102"],
        ["5", "11:15 - 12:00", "Science", "11-A", "Lab 1"]
    ],
    Wednesday: [
        ["1", "8:00 - 8:45", "Mathematics", "11-A", "Room 203"],
        ["2", "8:45 - 9:30", "Computer / AI", "10-A", "Computer Lab"],
        ["3", "9:30 - 10:15", "Science", "10-B", "Lab 1"],
        ["4", "10:30 - 11:15", "Mathematics", "12-A", "Room 204"],
        ["5", "11:15 - 12:00", "Class Activity", "11-B", "Room 202"]
    ],
    Thursday: [
        ["1", "8:00 - 8:45", "Computer / AI", "11-B", "Computer Lab"],
        ["2", "8:45 - 9:30", "Mathematics", "10-A", "Room 101"],
        ["3", "9:30 - 10:15", "Science", "12-A", "Lab 1"],
        ["4", "10:30 - 11:15", "Mathematics", "10-B", "Room 102"],
        ["5", "11:15 - 12:00", "Science", "11-A", "Lab 1"]
    ],
    Friday: [
        ["1", "8:00 - 8:45", "Mathematics", "12-A", "Room 204"],
        ["2", "8:45 - 9:30", "Science", "10-A", "Lab 1"],
        ["3", "9:30 - 10:15", "Mathematics", "11-B", "Room 202"],
        ["4", "10:30 - 11:15", "Computer / AI", "10-B", "Computer Lab"],
        ["5", "11:15 - 12:00", "Revision", "11-A", "Room 203"]
    ],
    Saturday: [
        ["1", "8:00 - 8:45", "Mathematics", "10-A", "Room 101"],
        ["2", "8:45 - 9:30", "Mathematics", "10-B", "Room 102"],
        ["3", "9:30 - 10:15", "Science", "11-A", "Lab 1"],
        ["4", "10:30 - 11:15", "Computer / AI", "12-A", "Computer Lab"]
    ]
};

function setupTimetable() {
    const tabs = document.querySelectorAll(".day-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");
            renderTimetable(tab.dataset.day);
        });
    });

    renderTimetable("Monday");
}

function renderTimetable(day) {
    const tbody = document.getElementById("timetableBody");
    const title = document.getElementById("timetableDayTitle");

    if (!tbody || !title) return;

    title.textContent = day;
    tbody.innerHTML = "";

    const schedule = teacherTimetable[day] || [];

    schedule.forEach(rowData => {
        const row = document.createElement("tr");
        row.innerHTML = rowData.map((value, index) =>
            `<td${index === 2 ? ' class="timetable-subject"' : ''}>${escapeHTML(value)}</td>`
        ).join("");
        tbody.appendChild(row);
    });

    if (!schedule.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">No classes scheduled for this day.</td>
            </tr>
        `;
    }
}


/* =========================================================
   CLEAR DATA
   ========================================================= */

function setupClearData() {

    document
        .getElementById("clearDataBtn")
        .addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to delete ALL student data?"
                    );


                if (!confirmed) return;


                students = [];

                saveData();

                updateAll();


                alert(
                    "All student data has been cleared."
                );

            }
        );

}


/* =========================================================
   SECURITY / HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    drawChart
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.deleteStudent =
    deleteStudent;

window.editStudent =
    editStudent;
