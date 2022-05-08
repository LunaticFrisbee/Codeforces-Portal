// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ENTER Personal API Key and Secret to see Friends in Line No. 145 & 146
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let usernameVal;

const getUserInfo = async () => {
  usernameVal = document.getElementById("username").value;
  await axios
    .get("https://codeforces.com/api/user.info?handles=" + usernameVal)
    .then((res) => {
      console.log(res);
      const result = res.data.result[0];
      console.log(result);

      if (res.data.status == "OK") {
        document.getElementById("pic").src = result.avatar;

        document.getElementById("handle").textContent =
          "Username: " + result.handle;

        document.getElementById("name").textContent =
          "Name: " + result.firstName + " " + result.lastName;

        document.getElementById("rating").textContent =
          "Rating: " + result.rating;

        document.getElementById("rank").textContent = "Rank: " + result.rank;

        document.getElementById("org").textContent =
          "Organisation: " + result.organization;

        document.getElementById("location").innerHTML =
          "Country: " + result.country;

        document.getElementById("friendcount").innerHTML =
          "Friends of: " + result.friendOfCount + " users";
      } else {
        document.getElementById("handle").innerHTML = "CP kro, Chad bano :)";
      }
    })
    .catch((err) => console.log(err));
  await getChart(usernameVal);
  await friends();
  await userBlog(usernameVal);
};

//Search activated when Enter pressed
var input = document.getElementById("username");
input.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
});

// //rating & graph
const getChart = async (usernameVal) => {
  await axios
    .get("https://codeforces.com/api/user.rating?handle=" + usernameVal)
    .then((res) => {
      console.log(res);
      if (res.data.result.length == 0) {
        document.getElementById("rating").innerHTML =
          "<strong> This User either does not exist or has not attempted any contests </strong>";
      } else {
        let labels = [];
        let data1 = [];
        for (i in res.data.result) {
          labels[i] = res.data.result[i].contestName;
          data1[i] = res.data.result[i].newRating;
        }

        new Chart("myChart", {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.8)",
                data: data1,
              },
            ],
          },
          options: {
            legend: { display: false },
          },
        });
      }
    });
};

//blog
const userBlog = async (usernameVal) => {
  let blogId;
  await axios
    .get("https://codeforces.com/api/user.blogEntries?handle=" + usernameVal)
    .then((res) => {
      console.log(res);
      const result = res.data.result[0];
      if (res.data.status == "FAILED") {
        document.getElementById(
          "blog"
        ).innerHTML = `Searched user has not contributed to any blogs`;
      } else if (res.data.status == "OK") {
        document.getElementById(
          "blog"
        ).innerHTML = `Title of Latest Blog: ${result.title}`;
        blogId = result.id;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  await comment(blogId);
};

//blogComments
const comment = async (blogId) => {
  await axios
    .get("https://codeforces.com/api/blogEntry.comments?blogEntryId=" + blogId)
    .then((res) => {
      console.log(res);
      if (res.data.status == "OK") {
        document.getElementById(
          "blog-commentator"
        ).innerHTML = `Commentator Name: ${res.data.result[0].commentatorHandle}`;

        document.getElementById(
          "blog-comment"
        ).innerHTML = `Comment: ${res.data.result[0].text}`;
      }
    });
};

//friends
const friends = async () => {
  const on_url =
    "https://codeforces.com/api/user.friends?onlyOnline=true&apiKey=";
  const all_url =
    "https://codeforces.com/api/user.friends?onlyOnline=false&apiKey=";
  const api_key = ""; ///!!!!!!!!!!!!!!!!ADD YOUR PERSONAL API-KEY HERE !!!!!!!!!!!!!!!!!!!!!##########################//
  const api_secret = ""; //!!!!!!!!!!!!!!!!! ADD YOUR PERSONAL SECRET HERE !!!!!!!!!!!!!!!!!!!!!##########################//
  const time = Math.floor(Date.now() / 1000);
  const on_tohash = `123456/user.friends?apiKey=${api_key}&onlyOnline=true&time=${time}#${api_secret}`;
  const all_tohash = `123456/user.friends?apiKey=${api_key}&onlyOnline=false&time=${time}#${api_secret}`;
  const onlinehashed = await SHA512(on_tohash);
  const allhashed = await SHA512(all_tohash);

  await axios
    .get(on_url + api_key + "&time=" + time + "&apiSig=123456" + onlinehashed)
    .then((response) => {
      console.log(response);
      on_friends = "<h3>Online Friends: </h3><br>";
      for (i in response.data.result) {
        on_friends +=
          `<strong id="green">` + response.data.result[i] + "</strong><br>";
      }
      document.getElementById("online-friends").innerHTML = on_friends;
    });

  await axios
    .get(all_url + api_key + "&time=" + time + "&apiSig=123456" + allhashed)
    .then((response) => {
      console.log(response);
      all_friends = "<h3>All Friends: </h3>";
      for (i in response.data.result) {
        all_friends += `<strong>` + response.data.result[i] + "</strong><br>";
      }
      document.getElementById("all-friends").innerHTML = all_friends;
    });
};

//SHA 512
async function SHA512(str) {
  return crypto.subtle
    .digest("SHA-512", new TextEncoder("utf-8").encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
}
