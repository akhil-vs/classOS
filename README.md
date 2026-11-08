# ClassOS

Interactive CBSE learning app for Mathematics, Physics and Chemistry — built for **students on phones and laptops**, with full **touch and mouse/keyboard** support.

Learners explore verified demos, change values, walk CBSE-style steps, and check understanding. Calculations come from a CAS, simulators and curated databases — the AI explains, and never invents answers.

## Planning docs

| Doc | Purpose |
| --- | --- |
| [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md) | Actionable product and phased build plan |
| [`docs/curriculum/inventory.json`](docs/curriculum/inventory.json) | Topic/chapter inventory by subject and class |
| [`docs/curriculum/topic-schema.md`](docs/curriculum/topic-schema.md) | Data contract for every topic module |
| [`docs/architecture/engines.md`](docs/architecture/engines.md) | Maths / Physics / Chemistry engine requirements |
| [`docs/architecture/web-app.md`](docs/architecture/web-app.md) | Student web app, responsive UI, input parity, milestones |
| [`docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf) | Source topic-by-topic plan |

## Build order (summary)

1. Shared learn workspace (responsive shell, input-kit, widgets, units)  
2. Class 9–10 Mathematics  
3. Class 9–10 Chemistry, then Physics  
4. Learner pilot on phones and laptops  
5–7. Classes 11–12 by subject  
8. Classes 6–8 foundation  

Validate each chapter against the current CBSE syllabus before development starts.
