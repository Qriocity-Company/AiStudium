// src/pages/GeneratedCoursePage.jsx
import { useState } from 'react';
import React from 'react';
import tick from '../../assets/tick.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowCircleDown, FaArrowCircleUp, FaArrowRight, FaArrowDown, FaTicketAlt } from 'react-icons/fa';
import StudentHeader from '../../components/StudentHeader';
import Chatbot from '../../components/Chatbot';
const GeneratedCoursePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state?.courseData;
const [unitCompletion, setUnitCompletion] = useState({});
const [openResources, setOpenResources] = useState({});
  const [openAssignment, setOpenAssignment] = useState({});
const toggleUnit = (index) => {
    setOpenUnits((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTopic = (index) => {
    setOpenTopics((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAssignment = (index) => {
    setOpenAssignment((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleResourse = (index) => {
    setOpenResources((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDetailedContent = (unitIndex) => {
    setOpenDetailedContent((prev) => ({
      ...prev,
      [unitIndex]: !prev[unitIndex],
    }));
  };

  const handleCheckboxChange = (index) => {
    setUnitCompletion((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (!unitCompletion[index]) {
      setOpenUnits((prev) => ({ ...prev, [index]: false }));
    }
  };

const [openUnits, setOpenUnits] = useState({});
  if (!courseData) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">No Course Data Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
        <StudentHeader/>
        <Chatbot/>
      <h1 className="text-3xl mt-32 font-bold mb-4 text-center">{courseData.courseTitle}</h1>
                {courseData && (
                  <div className="bg-gray-100 p-4 w-[800px] justify-self-center rounded-lg my-2">
                    <h3 className="text-2xl font-bold">{courseData.courseTitle}</h3>
                    {courseData.units.map((unit, index) => (
                      <div key={index} className="mt-6">
                        <div
                          onClick={() =>
                            !unitCompletion[index] && toggleUnit(index)
                          }
                          className={`flex items-center gap-4 bg-gray-200 hover:bg-gray-400 transition-all duration-300 rounded-lg p-3 ${
                            unitCompletion[index]
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!unitCompletion[index]}
                            onChange={() => handleCheckboxChange(index)}
                            className="cursor-pointer hidden size-5 transition-all duration-300"
                          />
                          <h5
                            className={`text-xl font-semibold flex-1 ${
                              unitCompletion[index]
                                ? "line-through text-gray-500"
                                : "text-gray-800"
                            }`}
                          >
                            Unit {index + 1}: {unit.unitTitle}
                            
                          </h5>
                          <p className="bg-white p-2 rounded-lg">{unit.estimatedDuration}</p>
                          {openUnits[index] ? (
                            <FaArrowCircleUp size={30} />
                          ) : (
                            <FaArrowCircleDown size={30} />
                          )}
                        </div>
                        
                        {openUnits[index] && (
                          <div className="mt-4">
                           <div className="w-full rounded-lg bg-gray-600 h-[300px] text-white flex items-center justify-center">
      {unit.youtube_video_url ? (
        <iframe
          width="100%"
          height="100%"
          src={unit.youtube_video_url.replace("watch?v=", "embed/")}
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          
        ></iframe>
      ) : (
        <p>No video available</p>
      )}
    </div>  
                            <div className="mt-4">
                            <h6
          onClick={() => toggleResourse(index)}
          className="font-semibold hover:bg-sky-200 cursor-pointer hover:shadow-md shadow-black transition-all duration-300 bg-white w-fit p-1 rounded-md flex"
        >
          {openResources[index] ? (
            <FaArrowDown size={15} className="mr-1 my-auto" />
          ) : (
            <FaArrowRight size={15} className="mr-1 my-auto" />
          )}
          Resources
        </h6>
        {openResources[index] && (
          <ul className="list-disc ml-6">
          {unit.resources.map((topic, idx) => (
            <li key={idx}>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(topic)} resources`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {topic}
              </a>
            </li>
          ))}
        </ul>
        )}
                          </div>
                          <div className="mt-4">
        <h6
          onClick={() => toggleAssignment(index)}
          className="font-semibold hover:bg-sky-200 cursor-pointer hover:shadow-md shadow-black transition-all duration-300 bg-white w-fit p-1 rounded-md flex"
        >
          {openAssignment[index] ? (
            <FaArrowDown size={15} className="mr-1 my-auto" />
          ) : (
            <FaArrowRight size={15} className="mr-1 my-auto" />
          )}
          Topics
        </h6>
        {openAssignment[index] && (
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            {unit.detailedContent.topicContents.map((topic, idx) => (
              <li key={idx} className="text-base">
                <span className="font-bold">{topic.topic}</span>
                <p className="text-md text-gray-700 ml-4">{topic.content}</p>

                <div className='w-full grid gap-2 rounded-xl mt-2 mb-5 grid-cols-2'>
                    <div className='border-black bg-gray-200 p-2 border rounded-xl'>
                    <p className="font-bold mt-2">Examples:</p>
                <ul className="list-decimal ml-6 mt-2 space-y-2">
            {topic.examples.map((ex, idx) => (
              <li key={idx} className="text-base">
                <span>{ex}</span>
              </li>
            ))}
              </ul>
                    </div>
                    <div className='border-black bg-gray-200 p-2 border rounded-xl'>
                    <p className="font-bold mt-2">Exercises:</p>
                <ul className="list-decimal ml-6 mt-2 space-y-2">
            {topic.exercises.map((ex, idx) => (
              <li key={idx} className="text-base">
                <span>{ex}</span>
              </li>
            ))}
              </ul>
                    </div>
                </div>
                
              
                
              </li>
            ))}
          </ol>
        )}
      </div>
      
                          <div className="mt-4 mx-auto w-full">
                          
                          
                          <button onClick={()=> handleCheckboxChange(index)} className='bg-green-300  justify-self-center hover:bg-green-500 transition-all duration-300 p-1 pr-3 rounded-lg flex'>
                           <img className='size-6 mr-2 m-2' src={tick}/>
                           <p className='my-auto'>Mark as Completed</p>
                           </button>
                           </div>
                          </div>
                        )}
                       
                      </div>
                    ))}
                    
                  </div>
                )}
                <div className='w-full flex justify-center'>
      <button
        onClick={() => navigate(-1)}
        className="bg-sky-300 mt-10 hover:bg-sky-600 hover:text-white text-black transition-all duration-300 px-4 py-2 justify-self-center rounded-lg"
      >
        Go Back
      </button>
      </div>
    </div>
  );
};

export default GeneratedCoursePage;
