import React, { useEffect, useState } from "react";
import StudentHeader from "../../components/StudentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SingleCourse = () => {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("userSelectedCourse"));
  const [courseData, setCourseData] = useState(null);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizResultsVisible, setQuizResultsVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});
  const [completed, setCompleted] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizModalVisible, setQuizModalVisible] = useState(false); // Modal visibility state for quiz selection
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch course data
  const getSingleCourse = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/course/singleCourse",
        {
          courseId: id,
        }
      );
      setCourseData(data?.course);
      // Initialize completion status for each video
      setCompletionStatus(
        data?.course.videoLectures.reduce((acc, _, index) => {
          acc[index] = false; // Initially, no video is marked as completed
          return acc;
        }, {})
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.post("http://localhost:8000/user/get-user", {
        id: userId,
      });
      const enrolledCourses = data?.user?.enrolledCourses || [];
      const matchingCourse = enrolledCourses.find(
        (course) => course?._id === courseData?._id
      );
      if (matchingCourse) {
        setCompleted(matchingCourse.completed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch both course data and user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSingleCourse();
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (courseData) {
        try {
          await getUserData();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [courseData]);

  // Handle video lecture click to update completion status
  const handleVideoClick = async (index) => {
    setCompletionStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      newStatus[index] = true; // Mark as completed
      return newStatus;
    });

    // Calculate and send completion data to backend
    const completionPercentage = calculateCompletionPercentage();
    try {
      await axios.post("http://localhost:8000/user/updateStatus", {
        userId: userId,
        courseId: courseData._id,
        status: completionPercentage,
      });
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  const calculateCompletionPercentage = () => {
    const totalVideos = courseData?.videoLectures.length;
    const completedVideos =
      Object.values(completionStatus).filter(Boolean).length;
    return (completedVideos / totalVideos) * 100;
  };

  // Handle quiz question answer change
  const handleAnswerChange = (quizId, questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [quizId]: {
        ...prevAnswers[quizId],
        [questionId]: answer,
      },
    }));
  };

  // Handle quiz submission
  const handleQuizSubmit = (quizId) => {
    let totalScore = 0;
    const quiz = courseData.quizes.find((quiz) => quiz._id === quizId);
    quiz.questions.forEach((question) => {
      const userAnswer = selectedAnswers[quizId]?.[question._id];
      if (userAnswer === question.correctAns) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    setCurrentQuiz(quiz); // Store the current quiz for result display
    setQuizAttempted(true);
    setQuizResultsVisible(true); // Show the modal with the score
  };

  const handleCloseModal = () => {
    setQuizResultsVisible(false); // Close the modal
  };

  const handleQuizModalClose = () => {
    setQuizModalVisible(false); // Close the quiz selection modal
  };

  const handleQuizSelection = (id) => {
    localStorage.setItem("userQuiz", JSON.stringify(id));
    navigate("/singleQuiz");
    setQuizModalVisible(false); // Close quiz modal
    setQuizAttempted(false); // Hide quiz attempt section
    setCurrentQuiz(quiz); // Set the quiz for attempting
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StudentHeader />
      <div className="container mx-auto p-4">
        <div className="course-details my-8">
          <div className="course-header text-center">
            <img
              src={courseData.image}
              alt={courseData.courseName}
              className="w-[300px] h-[300px] place-self-center mb-4 rounded-lg"
            />
            <h1 className="text-4xl font-bold">{courseData.courseName}</h1>
            <p className="text-lg mt-2">{courseData.description}</p>
          </div>

          <div className="video-lectures mt-8">
            <h2 className="text-2xl font-semibold mb-4">Video Lectures</h2>
            <div className="video-list">
              {courseData.videoLectures.map((video, index) => (
                <div className="video-item flex items-center mb-4" key={index}>
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={() => handleVideoClick(index)}
                  >
                    Video {index + 1}:{" "}
                    {new URL(video).searchParams.get("si")
                      ? "Lecture"
                      : "Lesson"}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="course-notes mt-8">
            <h2 className="text-2xl font-semibold mb-4">Course Notes</h2>
            {courseData.notes.map((note, index) => (
              <div key={index} className="note-item mb-4">
                <a
                  href={note}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download Note {index + 1}
                </a>
              </div>
            ))}
          </div>

          {/* Single "Attempt Quiz" button */}
          <div className="attempt-quiz mt-8">
            <button
              onClick={() => setQuizModalVisible(true)} // Show quiz modal
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Attempt Quiz
            </button>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizModalVisible && (
          <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Select a Quiz</h2>
              <ul className="quiz-list mb-4">
                {courseData.quizes.map((quiz, quizIndex) => (
                  <li key={quizIndex}>
                    <button
                      onClick={() => handleQuizSelection(quiz._id)}
                      className="text-blue-500 hover:underline"
                    >
                      {quiz.quizName}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleQuizModalClose}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Render quiz questions after attempting a quiz */}
        {quizAttempted && currentQuiz && (
          <div className="quiz-questions mt-8">
            <h3 className="text-xl font-medium">{currentQuiz.quizName}</h3>
            <div className="questions mt-4">
              {currentQuiz.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="question-item mb-2">
                  <p>{question.question}</p>
                  <ul className="option-list mt-2">
                    {question.option.map((option, optionIndex) => (
                      <li key={optionIndex} className="mb-1">
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          onChange={() =>
                            handleAnswerChange(
                              currentQuiz._id,
                              question._id,
                              option
                            )
                          }
                          checked={
                            selectedAnswers[currentQuiz._id]?.[question._id] ===
                            option
                          }
                          className="mr-2"
                        />
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleQuizSubmit(currentQuiz._id)}
              className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>

      {/* Modal for quiz results */}
      {quizResultsVisible && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Score: {score}</h2>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-red-500 text-white rounded mb-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleCourse;
