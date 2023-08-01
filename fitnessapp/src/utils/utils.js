export const formatDate = (today) => {
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  today = yyyy + "-" + mm + "-" + dd + "T" + hour + ":" + min + ":" + sec;
  return today;
};

export const simpleFormatDate = (today) => {
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

export const getLastWeekDatesPlusNameDays = () => {
  var today = new Date();
  var response = [];
  var finalResponse = [];
  var nameDay = "";
  for (var i = 0; i < 7; i++) {
    var newDate = new Date();
    newDate.setDate(today.getDate() - i);
    response.push(simpleFormatDate(newDate));
  }

  for (var j = 0; j < response.length; j++) {
    nameDay = new Date(response[j]).toString().split(" ")[0];
    finalResponse.push(nameDay + ", " + response[j]);
  }
  return finalResponse;
};

export const getLastWeekDates = () => {
  var today = new Date();
  var response = [];
  for (var i = 0; i < 7; i++) {
    var newDate = new Date();
    newDate.setDate(today.getDate() - i);
    response.push(simpleFormatDate(newDate));
  }
  return response;
};

export const getFutureDate = (noDays) => {
  var newDate = new Date();
  newDate.setDate(new Date().getDate() + noDays);

  return newDate;
};
