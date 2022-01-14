// contain functions we reuse over and over in project
import { TIMEOUT_SEC } from './config';

// return new promise that will reject after elapsed time
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // makes fetchPro based on parameters
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // convert data from web to json object
    const data = await res.json();

    // check if we get all data from api
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // return data from API aj JSON object
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/*
// function that will get JSON data from any URL and return as JSON object
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //fetch data from web api, make race to fail if it will be slowest as 0.5 sec
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // convert data from web to json object
    const data = await res.json();

    // check if we get all data from api
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // return data from API aj JSON object
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// function to send JSON data to the API
export const sendJSON = async function (url, uploadData) {
  try {
    // not only url but object with options
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    //fetch data from web api, make race to fail if it will be slowest as 0.5 sec
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // convert data from web to json object
    const data = await res.json();

    // check if we get all data from api
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // return data from API aj JSON object
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
*/
