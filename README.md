# ClassOS

Interactive CBSE Maths, Physics and Chemistry — **Learn** on phones/laptops, a **personal blackboard**, and a **classroom board** for live teaching.

Engines (CAS, simulators, curated databases) calculate; the AI explains and never invents answers. Touch and mouse/keyboard are both first-class.

## Modes

| Mode | Who | What |
| --- | --- | --- |
| Learn | Student | Guided topic path on phone or laptop |
| Personal blackboard | Student | Freeform ink + widgets on their device |
| Classroom board | Teacher + class | Projected live board; students join to vote/answer |

## Planning docs

| Doc | Purpose |
| --- | --- |
| [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md) | Product and phased build plan |
| [`docs/curriculum/inventory.json`](docs/curriculum/inventory.json) | Topic/chapter inventory |
| [`docs/curriculum/topic-schema.md`](docs/curriculum/topic-schema.md) | Topic module data contract |
| [`docs/architecture/engines.md`](docs/architecture/engines.md) | Engine requirements |
| [`docs/architecture/web-app.md`](docs/architecture/web-app.md) | Learn + personal board + classroom web plan |
| [`docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf`](docs/ClassOS_Full_Topic-by-Topic_Plan_CBSE.pdf) | Source topic-by-topic plan |

## Build order (summary)

1. Shared Learn shell + personal blackboard base  
2. Class 9–10 Mathematics  
3. Class 9–10 Chemistry, then Physics  
4. Learner pilot  
5. Classroom live board + `/join` + school admin  
6. Classroom pilot  
7–10. Classes 11–12, then 6–8 foundation  

Validate each chapter against the current CBSE syllabus before development starts.
