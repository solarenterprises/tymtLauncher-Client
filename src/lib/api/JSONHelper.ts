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
    if (typeof json1[key] !== typeof json2[key]) {
      return false;
    }

    // Recursively check nested objects
    if (typeof json1[key] === "object" && typeof json2[key] === "object") {
      if (!compareJSONStructure(json1[key], json2[key])) {
        return false;
      }
    }
  }

  return true;
};

// Example JSON objects for comparison
