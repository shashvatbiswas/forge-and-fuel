import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  PageNumber
} from 'docx';

function createBorderedCell(text, widthPercent, isHeader = false, align = AlignmentType.LEFT) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: isHeader ? { fill: 'F1F5F9' } : undefined,
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: isHeader,
            font: 'Times New Roman',
            size: 22
          })
        ]
      })
    ]
  });
}

function makeParagraph(text, options = {}) {
  const { bold = false, italic = false, size = 23, align = AlignmentType.JUSTIFIED, spaceAfter = 140, spaceBefore = 0 } = options;
  return new Paragraph({
    alignment: align,
    spacing: { after: spaceAfter, before: spaceBefore, line: 300 },
    children: [
      new TextRun({
        text,
        bold,
        italic,
        font: 'Times New Roman',
        size
      })
    ]
  });
}

function makeHeading(text, level = 2) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120 },
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Times New Roman',
        size: level === 1 ? 28 : 24,
        color: '000000'
      })
    ]
  });
}

function makeBullet(prefix, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    bullet: { level: 0 },
    spacing: { after: 100, line: 280 },
    children: [
      new TextRun({
        text: prefix + ': ',
        bold: true,
        font: 'Times New Roman',
        size: 22
      }),
      new TextRun({
        text,
        font: 'Times New Roman',
        size: 22
      })
    ]
  });
}

function makeTocRow(title, pageNum, isBold = false) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 85, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: isBold,
                font: 'Times New Roman',
                size: 22
              })
            ]
          })
        ]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: String(pageNum),
                bold: isBold,
                font: 'Times New Roman',
                size: 22
              })
            ]
          })
        ]
      })
    ]
  });
}

async function generateDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 23,
            color: '000000'
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 22
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ================= PAGE 1: TITLE PAGE =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({
                text: 'MIT-WPU',
                bold: true,
                size: 54,
                color: 'B91C1C',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'Dr. Vishwanath Karad MIT WORLD PEACE UNIVERSITY | PUNE',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1000 },
            children: [
              new TextRun({
                text: 'TECHNOLOGY, RESEARCH, SOCIAL INNOVATION & PARTNERSHIPS',
                size: 17,
                color: '555555'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'School of Computer Science & Engineering',
                bold: true,
                size: 30
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 500 },
            children: [
              new TextRun({
                text: 'Department of Computer Science and Applications',
                size: 26
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 500 },
            children: [
              new TextRun({
                text: '2026–2027',
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'SYNOPSIS',
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 500 },
            children: [
              new TextRun({
                text: 'On',
                italic: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            children: [
              new TextRun({
                text: 'FORGE & FUEL MATRIX: Advanced Fitness, Workout Analytics & Intelligent Nutrition Tracking System',
                bold: true,
                size: 32
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 2: METADATA & TEAM =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'Mini Project',
                bold: true,
                size: 34
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Course Code: XXXXXXXXX',
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'FIRST YEAR MSC COMPUTER SCIENCE',
                bold: true,
                size: 26
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'Year: 2026–2027',
                size: 23
              })
            ]
          }),

          makeParagraph('Group Id: [GROUP ID]', { bold: true, spaceAfter: 120 }),
          makeParagraph('Team Leader: [TEAM LEADER NAME]', { bold: true, spaceAfter: 300 }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createBorderedCell('S.No.', 15, true, AlignmentType.CENTER),
                  createBorderedCell('Team Members', 55, true),
                  createBorderedCell('PRN', 30, true, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('1', 15, false, AlignmentType.CENTER),
                  createBorderedCell('[STUDENT NAME 1]', 55),
                  createBorderedCell('[PRN 1]', 30, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('2', 15, false, AlignmentType.CENTER),
                  createBorderedCell('[STUDENT NAME 2]', 55),
                  createBorderedCell('[PRN 2]', 30, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('3', 15, false, AlignmentType.CENTER),
                  createBorderedCell('[STUDENT NAME 3]', 55),
                  createBorderedCell('[PRN 3]', 30, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('4', 15, false, AlignmentType.CENTER),
                  createBorderedCell('[STUDENT NAME 4]', 55),
                  createBorderedCell('[PRN 4]', 30, false, AlignmentType.CENTER)
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 500, after: 200 }, children: [
            new TextRun({ text: 'Project Title: ', bold: true, size: 24 }),
            new TextRun({ text: 'FORGE & FUEL MATRIX: Advanced Fitness, Workout Analytics & Intelligent Nutrition Tracking System', size: 23 })
          ]}),

          new Paragraph({ spacing: { before: 200, after: 400 }, children: [
            new TextRun({ text: 'Name of the Mentor: ', bold: true, size: 24 }),
            new TextRun({ text: '[MENTOR NAME]', size: 23 })
          ]}),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 3: DECLARATION =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: 'Declaration',
                bold: true,
                size: 32
              })
            ]
          }),

          makeParagraph('This declaration is part of the Synopsis for project work entitled "FORGE & FUEL MATRIX: Advanced Fitness, Workout Analytics & Intelligent Nutrition Tracking System" submitted as part of academic requirement for Semester II of FIRST YEAR MSC COMPUTER SCIENCE to the Dr. Vishwanath Karad MIT World Peace University.', { spaceAfter: 300 }),

          makeParagraph('I, [STUDENT NAME] [PRN] solely declare that:', { spaceAfter: 200 }),

          new Paragraph({
            numbering: { reference: 'numbered-list', level: 0 },
            spacing: { after: 120 },
            children: [new TextRun({ text: '1. I will not use any unfair means to complete the project.', size: 23 })]
          }),
          new Paragraph({
            numbering: { reference: 'numbered-list', level: 0 },
            spacing: { after: 120 },
            children: [new TextRun({ text: '2. I will follow the discipline and the rules of the organization where I am doing the project.', size: 23 })]
          }),
          new Paragraph({
            numbering: { reference: 'numbered-list', level: 0 },
            spacing: { after: 300 },
            children: [new TextRun({ text: '3. I will not do or be part of any act which may impact the college reputation adversely.', size: 23 })]
          }),

          makeParagraph('The information I have given is true, complete and accurate. I understand that failure to give truthful, incomplete and inaccurate information may result in cancellation of my project work.', { spaceAfter: 600 }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      makeParagraph('Date: [DD/MM/YYYY]', { spaceAfter: 80 }),
                      makeParagraph('Place: Pune', { spaceAfter: 0 })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Name and Signature of Student', bold: true, size: 23 })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 500 },
                        children: [
                          new TextRun({ text: '[STUDENT NAME]', bold: true, size: 23 })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 4: TABLE OF CONTENTS =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: 'Table of Contents',
                bold: true,
                size: 32
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTocRow('Declaration', '3'),
              makeTocRow('1. Brief Overview of the Project', '9', true),
              makeTocRow('2. Background of the Project', '10', true),
              makeTocRow('3. Domain / Technology Used', '11', true),
              makeTocRow('4. Problem Statement', '13', true),
              makeTocRow('5. Objectives and Scope of the Project', '13', true),
              makeTocRow('     Objectives', '13'),
              makeTocRow('     Scope', '14'),
              makeTocRow('6. Methodology / Implementation Plan', '14', true),
              makeTocRow('     System Design Diagrams', '16'),
              makeTocRow('     Entity-Relationship (ER) Diagram', '18'),
              makeTocRow('7. Expected Outcome', '20', true),
              makeTocRow('8. Work Plan / Timeline', '20', true)
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 5: LIST OF FIGURES =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: 'List of Figures',
                bold: true,
                size: 32
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeTocRow('Figure 1: System Architecture and Layered Client-Side Engine', '12'),
              makeTocRow('Figure 2: User Navigation & Client-Side Page Routing Flow', '15'),
              makeTocRow('Figure 3: Workout Selection and Set Logging Activity Lifecycle', '15'),
              makeTocRow('Figure 4: Calorie & Macro Calculation Logic (Mifflin-St Jeor Engine)', '17'),
              makeTocRow('Figure 5: Entity-Relationship (ER) Conceptual Data Schema', '18'),
              makeTocRow('Figure 6: LocalStorage Offline Data Persistence Flow', '19'),
              makeTocRow('Figure 7: HTML5 Canvas 2D Biomechanical Motion Visualizer', '21')
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 6: SECTIONS 1 TO 4 =================
          makeHeading('1. Brief Overview of the Project', 1),
          makeParagraph('FORGE & FUEL MATRIX is an all-in-one fitness and nutrition web application designed to help people manage their daily workouts, track their food intake, and learn proper exercise form in one simple, unified dashboard.'),
          makeParagraph('Purpose: Many beginners struggle because fitness tools are scattered across different apps (one for calorie counting, one for workouts, and videos for form). FORGE & FUEL solves this by combining scientific calorie calculations, animated exercise form guides, daily meal tracking, and motivational support into a single, clean web application.'),
          
          makeParagraph('Major Functions:', { bold: true, spaceAfter: 80 }),
          makeBullet('Automatic Calorie & Macro Calculator', 'Calculates daily calorie needs (BMR & TDEE) and gives exact grams of Protein, Carbs, and Fats based on the user\'s goal (Fat Loss, Muscle Gain, or Maintenance).'),
          makeBullet('Interactive Exercise Guide with 2D Visualizer', 'Displays workouts by muscle group with an animated HTML5 Canvas visualizer showing the correct bar and movement path for lifts like Squats and Bench Press.'),
          makeBullet('Daily Diet & Hydration Tracker', 'Lets users search foods, log custom meals, track water intake, and view live progress bars toward their daily calorie limits.'),
          makeBullet('Fitness Knowledge & Motivation', 'Science-backed articles on nutrition and daily mindset quotes.'),
          makeBullet('Theme Switcher', '5 color themes (Cyber Neon, Sapphire Luxury, Crimson, Amber Gold, Arctic Light).'),
          
          makeParagraph('Target Users: College students, gym beginners, athletes, and personal trainers looking for a fast, free, and distraction-free fitness companion.'),
          makeParagraph('Expected Contribution: A lightweight, responsive web app that runs offline in any browser, requires no paid subscriptions, and keeps all personal fitness data safely on the user\'s device.'),

          makeHeading('2. Background of the Project', 1),
          makeParagraph('Maintaining physical health is essential, yet most people find fitness apps frustrating. Commercial mobile apps frequently charge costly monthly subscriptions for basic features like macro counting, show excessive ads, and run slowly over poor gym internet connections. FORGE & FUEL was created to provide a modern, open, and fast web application that works completely in the browser without subscriptions or delays.'),

          makeHeading('3. Domain / Technology Used', 1),
          makeParagraph('Project Domain: Web Application Development, Health Informatics & Sports Software.'),
          makeParagraph('Frontend Technologies:', { bold: true, spaceAfter: 60 }),
          makeBullet('HTML5', 'Semantic structure for all pages and forms.'),
          makeBullet('Vanilla CSS3', 'Custom CSS properties (design tokens) for smooth layout, responsive mobile design, and 5 interactive color themes without heavy framework dependencies.'),
          makeBullet('JavaScript (ES6 Modules)', 'Application routing, calorie calculation logic, and reactive UI updates.'),
          makeBullet('HTML5 Canvas API', 'Real-time 2D animated kinetic drawings demonstrating correct exercise form.'),
          makeBullet('Vite 5', 'Modern build tool for high-speed local development and optimized deployment.'),
          makeBullet('HTML5 LocalStorage', 'Client-side storage to save user profiles, logged meals, and workout sets permanently on the device without needing an external database server.'),

          makeHeading('4. Problem Statement', 1),
          makeParagraph('Fitness beginners fail to reach their goals due to three common obstacles: (1) they do not know their daily caloric and protein targets, (2) they risk injuries because static workout images do not explain proper lifting form and movement cadence, and (3) commercial fitness apps are expensive and require continuous high-speed internet. FORGE & FUEL MATRIX directly solves this by providing a free, local-first web app that calculates exact dietary targets, visualizes exercise movement paths using animated 2D graphics, and logs daily meals and workouts with zero lag.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 7: SECTIONS 5 & 6 =================
          makeHeading('5. Objectives and Scope of the Project', 1),
          makeHeading('5.1 Objectives', 2),
          makeBullet('O1', 'Implement the Mifflin-St Jeor scientific formula to accurately calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on user age, gender, height, weight, and activity level.'),
          makeBullet('O2', 'Build an automated macronutrient calculator that divides total calories into Protein, Carbs, and Fats according to the user\'s selected fitness goal (Cut, Bulk, or Recomposition).'),
          makeBullet('O3', 'Develop an animated HTML5 Canvas 2D engine that visually demonstrates correct exercise movement paths for key compound lifts.'),
          makeBullet('O4', 'Provide a real-time food and water tracking system where users can log meals, add custom items, and watch daily nutritional progress update instantly.'),
          makeBullet('O5', 'Create a responsive, 5-theme user interface using CSS design tokens that operates smoothly on both mobile phones and desktop computers.'),
          makeBullet('O6', 'Implement local-first data storage using browser LocalStorage so that all user profiles and logs are saved securely and work offline.'),

          makeHeading('5.2 Scope', 2),
          makeParagraph('What the Project Covers: Complete biometric user profiling, automated calorie/macro calculations, interactive workout directory with muscle categorization, 2D animated form visualizer, meal and water logging, fitness knowledge articles, motivational quote bookmarks, and 5 color themes.'),
          makeParagraph('Exclusions (Future Enhancements): Bluetooth synchronization with wearable smartwatches (Apple Watch / Fitbit) and multi-device cloud synchronization will be incorporated in Phase 2.'),

          makeHeading('6. Methodology / Implementation Plan', 1),
          makeParagraph('The project follows an Iterative Agile Methodology: (1) Formula research & mathematical engine, (2) UI layout & 5-theme token setup, (3) Exercise library with Canvas animations, (4) Diet tracker & LocalStorage integration, and (5) Testing and optimization.'),

          makeHeading('6.1 System Design Diagrams', 2),
          makeParagraph('Figure 1: High-Level System Architecture', { bold: true, spaceAfter: 60 }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '[User Interface Layer] -> [Application Controller & Router] -> [Computational & Graphics Engine] -> [LocalStorage Data Layer]',
                font: 'Courier New',
                size: 20,
                bold: true
              })
            ]
          }),
          makeParagraph('Figure 4: Calorie & Macro Calculation Flow', { bold: true, spaceAfter: 60 }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'User Inputs (W, H, Age, Gender, Activity) -> BMR (Mifflin-St Jeor) -> TDEE -> Goal Adjustment (Cut -20% / Bulk +15%) -> Macro Split (P / C / F)',
                font: 'Courier New',
                size: 20
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= PAGE 8: SECTIONS 6.2 TO 8 =================
          makeHeading('6.2 Entity-Relationship (ER) Diagram', 2),
          makeParagraph('Figure 5: Conceptual Entity-Relationship Data Schema', { bold: true, spaceAfter: 60 }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: '• USER_PROFILE (1:N) ──► LOGGED_MEAL\n• USER_PROFILE (1:N) ──► EXERCISE_SET\n• EXERCISE_MASTER (1:N) ──► EXERCISE_SET',
                font: 'Courier New',
                size: 21,
                bold: true
              })
            ]
          }),

          makeHeading('7. Expected Outcome', 1),
          makeParagraph('The project delivers a fully working, responsive web application that runs smoothly on any browser with the following outcomes:'),
          makeBullet('Immediate Calorie & Macro Prescriptions', 'Eliminates guesswork by providing exact daily caloric and macronutrient targets within seconds.'),
          makeBullet('Injury Prevention via 2D Animations', 'Visualizes movement paths directly in the browser so users can check proper exercise mechanics.'),
          makeBullet('Effortless Daily Tracking', 'Allows users to log food, water, and workout sets with instant visual progress bars.'),
          makeBullet('Zero Cost & Complete Privacy', 'Runs without paid subscriptions, keeping all user health data securely in the user\'s own browser storage.'),

          makeHeading('8. Work Plan / Timeline Table', 1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createBorderedCell('Sr. No.', 10, true, AlignmentType.CENTER),
                  createBorderedCell('Activity / Phase', 45, true),
                  createBorderedCell('Start Date', 16, true, AlignmentType.CENTER),
                  createBorderedCell('End Date', 16, true, AlignmentType.CENTER),
                  createBorderedCell('Status', 13, true, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('1', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Requirement Gathering & Formula Verification', 45),
                  createBorderedCell('01/08/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('14/08/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('2', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Architecture Design & UI Theme Planning', 45),
                  createBorderedCell('15/08/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('28/08/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('3', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Calorie & Macro Calculation Engine (BMR/TDEE)', 45),
                  createBorderedCell('29/08/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('10/09/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('4', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Workout Hub & HTML5 Canvas 2D Visualizer', 45),
                  createBorderedCell('11/09/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('22/09/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('5', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Diet Tracker, Food DB & LocalStorage Setup', 45),
                  createBorderedCell('23/09/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('05/10/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('6', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Fitness Articles & Motivational Quotes Module', 45),
                  createBorderedCell('06/10/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('18/10/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('Completed', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('7', 10, false, AlignmentType.CENTER),
                  createBorderedCell('System Integration & Cross-Browser Testing', 45),
                  createBorderedCell('19/10/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('31/10/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('In Progress', 13, false, AlignmentType.CENTER)
                ]
              }),
              new TableRow({
                children: [
                  createBorderedCell('8', 10, false, AlignmentType.CENTER),
                  createBorderedCell('Final Documentation & Project Synopsis Submission', 45),
                  createBorderedCell('01/11/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('15/11/2026', 16, false, AlignmentType.CENTER),
                  createBorderedCell('In Progress', 13, false, AlignmentType.CENTER)
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('C:\\Users\\DDR\\Desktop\\FORGE-FUEL-Matrix\\FORGE_FUEL_SYNOPSIS.docx', buffer);
  console.log('Successfully generated FORGE_FUEL_SYNOPSIS.docx');
}

generateDocx().catch(err => {
  console.error(err);
  process.exit(1);
});
