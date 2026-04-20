export const rootCauseOptions = [
  "Concept Gap",
  "Careless Error",
  "Misread Question",
  "Weak Revision Habit",
  "Needs More Review",
];

export const revisionStatusOptions = [
  "Needs Revision",
  "Revising",
  "Done",
];

export function suggestRootCause(formData) {
  const questionText = (formData.questionText || "").toLowerCase();
  const studentNote = (formData.studentNote || "").toLowerCase();

  if (
    questionText.includes("not") ||
    questionText.includes("except") ||
    studentNote.includes("misread") ||
    studentNote.includes("read too fast") ||
    studentNote.includes("did not notice")
  ) {
    return "Misread Question";
  }

  if (
    studentNote.includes("silly") ||
    studentNote.includes("careless") ||
    studentNote.includes("rushed") ||
    studentNote.includes("calculation") ||
    studentNote.includes("sign error")
  ) {
    return "Careless Error";
  }

  if (
    studentNote.includes("forgot") ||
    studentNote.includes("confused") ||
    studentNote.includes("concept") ||
    studentNote.includes("formula") ||
    studentNote.includes("did not know")
  ) {
    return "Concept Gap";
  }

  if (
    studentNote.includes("did not revise") ||
    studentNote.includes("not enough practice") ||
    studentNote.includes("last minute")
  ) {
    return "Weak Revision Habit";
  }

  return "Needs More Review";
}

export function getTopRootCause(mistakes) {
  if (!mistakes.length) {
    return "No mistakes yet";
  }

  const counts = {};

  mistakes.forEach((mistake) => {
    const rootCause = mistake.rootCause || "Needs More Review";
    counts[rootCause] = (counts[rootCause] || 0) + 1;
  });

  return Object.entries(counts).sort((firstItem, secondItem) => {
    return secondItem[1] - firstItem[1];
  })[0][0];
}

export function getRevisionTip(rootCause, topic) {
  if (rootCause === "Concept Gap") {
    return `Relearn the main idea in ${topic} and solve 5 fresh questions from that topic.`;
  }

  if (rootCause === "Careless Error") {
    return `Practice ${topic} with a timer and check each final step before moving on.`;
  }

  if (rootCause === "Misread Question") {
    return `Underline keywords in ${topic} questions and rewrite the question in your own words.`;
  }

  if (rootCause === "Weak Revision Habit") {
    return `Add ${topic} to your weekly revision timetable and revisit it twice this week.`;
  }

  return `Review ${topic} once more and write a short note about why the answer was wrong.`;
}

export function buildRevisionPlan(mistakes) {
  const activeMistakes = mistakes.filter((mistake) => mistake.revisionStatus !== "Done");
  const groups = {};

  activeMistakes.forEach((mistake) => {
    const topic = mistake.topic || "General";

    if (!groups[topic]) {
      groups[topic] = {
        topic,
        totalMistakes: 0,
        reasons: {},
      };
    }

    groups[topic].totalMistakes += 1;

    const reason = mistake.rootCause || "Needs More Review";
    groups[topic].reasons[reason] = (groups[topic].reasons[reason] || 0) + 1;
  });

  return Object.values(groups)
    .map((group) => {
      const mainReason = Object.entries(group.reasons).sort((firstItem, secondItem) => {
        return secondItem[1] - firstItem[1];
      })[0][0];

      return {
        topic: group.topic,
        totalMistakes: group.totalMistakes,
        mainReason,
        action: getRevisionTip(mainReason, group.topic),
      };
    })
    .sort((firstItem, secondItem) => {
      return secondItem.totalMistakes - firstItem.totalMistakes;
    });
}
