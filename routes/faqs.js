var express = require("express");
var router = express.Router();

/* GET faqs */
router.get("/", async (req, res, next) => {
  const faqs = [
    {
      question: "How to register as a Student?",
      answer:
        "You can get an access code from your instuctor to be able to complete registeration process and add your own information then customize your profile.",
    },
    {
      question: "How to enroll in a Course as a Student?",
      answer:
        "As long as you have an access code from instructor you will have the ability to enroll in a course and see all information about this course.",
    },
    {
      question: "How to register as a Instructor?",
      answer:
        "You can choose your suitable plan from pricing table and continue adding your own information and customize your own profile.",
    },
    {
      question: "How to add a Course as a Instructor?",
      answer:
        "You can go to courses page, then click on add a course and put all couse information to be appeared to your own students.",
    },
    {
      question: "How to pay for subscription?",
      answer:
        "Once you create an account you can choose your plan and pay through your paypal account.",
    },
    {
      question: "How to add new event or todo?",
      answer:
        "You can click on forgot password and type your email and you will get an email with link allow you to change you password.",
    },
    {
      question: "How to send a message as a student?",
      answer:
        "You can go to your profile and click on send message and and type your message then click send button",
    },
  ];
  res.json({ faqs });
});

module.exports = router;
