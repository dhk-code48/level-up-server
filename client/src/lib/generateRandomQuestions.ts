const generateRandomQuestions = (
  questions: question[],
  numberOfQuestionsToSelect: number
): question[] | null => {
  console.log(questions);
  const totalQuestions = questions.length;

  // Make sure there are enough questions to select
  if (totalQuestions >= numberOfQuestionsToSelect) {
    const selectedIndices: number[] = [];
    while (selectedIndices.length < numberOfQuestionsToSelect) {
      const randomIndex = Math.floor(Math.random() * totalQuestions);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }

    const selectedQuestions = selectedIndices.map((index) => questions[index]);
    return selectedQuestions;
  } else {
    console.error("Not enough questions in the array.");
    return null;
  }
};
export default generateRandomQuestions;
