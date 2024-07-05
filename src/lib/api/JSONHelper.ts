import { ChatMessageType, IAlert } from "../../types/chatTypes";

// Function to compare if two JSON objects have the same structure
export const compareJSONStructure = (json1, json2) => {
  // Get keys of both JSON objects
  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if keys are the same in both JSON objects
  for (let key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    // Check data types of the values
    // if (typeof json1[key] !== typeof json2[key]) {
    //   return false;
    // }

    // Recursively check nested objects
    // if (typeof json1[key] === "object" && typeof json2[key] === "object") {
    //   if (!compareJSONStructure(json1[key], json2[key])) {
    //     return false;
    //   }
    // }
  }

  return true;
};

export const addChatHistory = (array1: ChatMessageType[], array2: ChatMessageType[], pageSize: number) => {
  if (array1.length < pageSize) {
    return array2;
  }

  array1.splice(-(array1.length % pageSize));

  const resultArray = [...array1, ...array2];
  return resultArray;

  // const resultArray: ChatMessageType[] = [...array1];
  // for (const obj of array2) {
  //   if (!resultArray.some((item) => item._id === obj._id)) {
  //     resultArray.push(obj);
  //   }
  // }
  // return resultArray;
};

export const addAlertHistory = (array1: IAlert[], array2: IAlert[]) => {
  const resultArray: IAlert[] = [...array1];
  for (const obj of array2) {
    if (!resultArray.some((item) => item._id === obj._id)) {
      resultArray.push(obj);
    }
  }
  return resultArray;
};
