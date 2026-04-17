import { InputModeOptions } from "react-native";

export const PROFILE_LIMIT = 5;

export const cloudinaryBucketName = "dov4w6kya";
export const uploadPreset = "ml_default";
export const dummyImageURL =
  "https://imgs.search.brave.com/uLARhH16ug7xgUl3msl3yHs0DCWkofOAnLVeWQ-poy0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a2luZHBuZy5jb20v/cGljYy9tLzI1Mi0y/NTI0Njk1X2R1bW15/LXByb2ZpbGUtaW1h/Z2UtanBnLWhkLXBu/Zy1kb3dubG9hZC5w/bmc";
export const paymentCredentials = {
  razorpayKey: "rzp_live_1pQiEGyo5R94fg",
  razorpaySecret: "t5q5TrDSvf4vXN5u9HkC0U7e",
  image: "",
  currency: "INR",
  name: "Good Luck",
  description: "Payment for good luck!",
};
export const AGORA_APP_ID = "ef40e7bf43a541bfa99779b82eca7957";
export const HomeScreenOptions = {
  landhomelocalservicespage: {
    optionOne: {
      title: "Buy property",
      navigation: "homeSellPage",
      icon: "../../assets/homeSell.png",
    },
    optionTwo: {
      title: "Sell property",
      navigation: "landSellPage",
      icon: "../../assets/landSell.png",
    },
    optionThree: {
      title: "Ad post for Home & Land",
      navigation: "addPostForLand",
      icon: "../../assets/adPost.png",
    },
    optionFour: {
      title: "see your ads",
      navigation: "showYourLandPosts",
      icon: "../../assets/adPost.png",
    },
  },

  joblocalservicespage: {
    optionOne: {
      title: "Govt job",
      navigation: "govtjobPage",
      icon: "../../assets/homeSell.png",
    },
    optionTwo: {
      title: "Private job",
      navigation: "privatejobPage",
      icon: "../../assets/landSell.png",
    },
    optionThree: {
      title: "Ad post for Job",
      navigation: "addPostForJob",
      icon: "../../assets/adPost.png",
    },
    optionFour: {
      title: "Show your ads",
      navigation: "showYourJobPosts",
      icon: "../../assets/adPost.png",
    },
  },
};

export const textAddHomeAndLandFields: {
  multiline?: true;

  placeholder: string;
  inputMode: InputModeOptions;
  type: string;
  maxLength: number; // Assuming max length for a text input
}[] = [
    {
      placeholder: "Title",
      type: "title",
      inputMode: "text", // For general text input
      maxLength: 50, // Assuming max length for a title
    },
    {
      placeholder: "Phone",
      type: "phone",
      inputMode: "numeric", // For phone numbers
      maxLength: 10, // Assuming 10-digit phone numbers
    },
    {
      placeholder: "State",
      type: "state",

      inputMode: "text", // For state names
      maxLength: 30, // Assuming max length for a state name
    },
    {
      placeholder: "City",
      type: "city",
      inputMode: "text", // For city names
      maxLength: 30, // Assuming max length for a city name
    },
    {
      placeholder: "Pin",
      type: "pin",
      inputMode: "numeric", // For numeric PIN codes
      maxLength: 6, // Assuming 6-digit PIN codes
    },

    {
      placeholder: "Price",
      type: "price",
      inputMode: "text", // For numeric PIN codes
      maxLength: 10, // Assuming 6-digit PIN codes
    },

    {
      placeholder: "Write Your Description",
      type: "description",
      inputMode: "text", // For numeric PIN codes
      maxLength: 1000, // Assuming 6-digit PIN codes
      multiline: true,
    },
  ];

export const textAddJobFields: {
  type: string;
  multiline?: true;
  placeholder: string;
  inputMode: InputModeOptions;
  maxLength: number; // Assuming max length for a text input
}[] = [
    {
      placeholder: "Title",
      type: "title",
      inputMode: "text", // For general text input
      maxLength: 50, // Assuming max length for a title
    },
    {
      placeholder: "Company name",
      type: "companyName",
      inputMode: "text", // For general text input
      maxLength: 100, // Assuming max length for a title
    },
    {
      placeholder: "Website",
      type: "website",
      inputMode: "text", // For general text input
      maxLength: 1000, // Assuming max length for a title
    },
    {
      placeholder: "Work Location",
      type: "workLocation",
      inputMode: "text", // For general text input
      maxLength: 50, // Assuming max length for a title
    },
    {
      placeholder: "Phone",
      type: "phone",
      inputMode: "numeric", // For phone numbers
      maxLength: 10, // Assuming 10-digit phone numbers
    },
    {
      placeholder: "State",
      type: "state",
      inputMode: "text", // For state names
      maxLength: 30, // Assuming max length for a state name
    },
    {
      placeholder: "City",
      type: "city",
      inputMode: "text", // For city names
      maxLength: 30, // Assuming max length for a city name
    },
    {
      placeholder: "Address",
      type: "address",
      inputMode: "text", // For city names
      maxLength: 50, // Assuming max length for a city name
    },
    {
      placeholder: "Pin",
      type: "pin",
      inputMode: "numeric", // For numeric PIN codes
      maxLength: 6, // Assuming 6-digit PIN codes
    },

    {
      placeholder: "Salary",
      type: "salary",
      inputMode: "text", // For numeric PIN codes
      maxLength: 10, // Assuming 6-digit PIN codes
    },

    {
      placeholder: "Write Your Description",
      type: "description",
      inputMode: "text", // For numeric PIN codes
      maxLength: 1000, // Assuming 6-digit PIN codes
      multiline: true,
    },
  ];
