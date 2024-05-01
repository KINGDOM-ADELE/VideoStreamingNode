const sanitizeData = (data) => {
  const dataTypeOf = typeof(data);
  let newData;

  function convert(str) {
      str = str.replace(/>/g, "&gt;");
      str = str.replace(/</g, "&lt;");
      str = str.replace(/"/g, "&quot;");
      str = str.replace(/'/g, "&#039;");
      str = str.replace(/}/g, "&#125;");
      str = str.replace(/{/g, "&#123;");
      str = str.replace(/~/g, "&#126;");
      str = str.replace(/`/g, "&#96;");
      str = str.replace(/;/g, "&#59;");
      str = str.replace(/,/g, "&#44;");
      return str;
  }

  function handleArrays(xArray) {
      let type;
      let newArray = [];
      xArray.map((data, i) => {
          type = typeof(data);
          if (type === 'string') {
              newArray.push(convert(data));
          } else if (type === 'array') {
              newArray.push(handleArrays(data));
          } else if (type === 'number') {
              newArray.push(convert(data));
          } else {
              newArray.push(convert(data));
          }
          return (i);
      });
      return (newArray);
  }

  function handleObjects(obj) {
      let type;
      for (let prop in obj) {
          type = typeof(obj[prop]);
          if (type === 'string') {
              obj[prop] = `${convert(obj[prop])}`;
          } else if (type === 'array') {
              obj[prop] = handleArrays(obj[prop]);
          } else if (type === 'object') {
              obj[prop] = handleObjects(obj[prop]);
          } else if (type === 'number') {
              obj[prop] = `${obj[prop]}`;
          } else {
              obj[prop] = `${obj[prop]}`;
          }
      }
      return (obj);
  }

  function handleSanitization(data, dataTypeOf) {
      let newdata;
      if (dataTypeOf === 'string') {
          newdata = `${convert(data)}`;
      } else if (dataTypeOf === 'array') {
          newdata = handleArrays(data);
      } else if (dataTypeOf === 'object') {
          newdata = handleObjects(data);
      } else if (dataTypeOf === 'number' || dataTypeOf === 'boolean') {
          newdata = `${data}`;
      } else {
          newdata = `${data}`;
      }
      return (newdata);
  }
  newData = handleSanitization(data, dataTypeOf);
  return (newData);
};

export default sanitizeData;
