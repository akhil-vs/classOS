# Topic module schema

Every ClassOS chapter topic is packaged as a data-driven module. Curriculum changes update manifests; engines stay stable.

## Required fields

```json
{
  "id": "math.10.quadratic-equations.discriminant",
  "subject": "mathematics",
  "classLevel": 10,
  "chapter": "Quadratic Equations",
  "topic": "Nature of roots / discriminant",
  "syllabusYear": "2025-26",
  "status": "planned",
  "studentInput": {
    "touch": ["drag parabola coeffs", "slider for a,b,c"],
    "pointerKeyboard": ["type a,b,c", "arrow-adjust focused slider"]
  },
  "boardResponse": "Parabola with live discriminant; nature of roots updates",
  "understandingGoal": "Why the formula works and what the discriminant means",
  "modes": ["see", "predict", "build", "derive", "solve", "check"],
  "misconceptions": [
    {
      "error": "Discriminant only tells number of roots, not nature",
      "demo": "Slider across D>0, D=0, D<0 with root markers"
    }
  ],
  "engines": ["cas", "graph"],
  "goldenTests": ["ncert.ex.4.3.q1", "cbse.2024.set1.q..."],
  "languages": ["en", "hi"]
}
```

## Pedagogical contract

For each topic the product must state three things:

1. **Input** — how the learner or teacher drives the demo on touch and on mouse/keyboard (both required); include typical ink/template triggers for blackboard modes.
2. **Board response** — live demonstration, simulation, or solver that opens.
3. **Understanding goal** — concept or misconception the demo is designed to fix.

Topics must work in **Learn**, **personal blackboard**, and **classroom board** without forking engine logic.

## Universal modes

| Mode | Learn / personal board | Classroom board |
| --- | --- | --- |
| See it | Clean visual with no numbers | Teacher runs the visual |
| Predict | Freeze; learner picks; then reveal | Freeze; class votes via `/join`; then reveal |
| Build it | Learner changes values | Teacher or invited student changes values |
| Derive it | Formula built from the demonstration | Same, teacher-paced |
| Solve it | CBSE worked example with marks | Same, on the live board |
| Check it | Personal questions from widget state | Pushed to joined student devices |

## Ship gate per chapter

A chapter does not ship until:

1. Current CBSE syllabus validation is recorded for that chapter.
2. Every NCERT worked example and tagged exercise in the golden set passes.
3. Two-path verification has no unresolved disagreements on golden items.
4. A CBSE-experienced subject teacher has reviewed pedagogy and misconception cards.
5. Assumption banners / scope refusals are present where required.
6. Touch and non-touch paths for required interactions are verified in QA (phone + laptop).
