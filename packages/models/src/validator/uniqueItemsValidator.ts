const uniqueItemsValidator = {
  validator: (value: any[]) => {
    return new Set(value).size === value.length;
  },
  message: "Items in the array must be unique",
};

export default uniqueItemsValidator;
