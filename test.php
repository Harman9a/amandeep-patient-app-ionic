<?php

if(isset($_GET['payment_intent'])){
    header('location: result.php?id='.$_GET['payment_intent']);
}


?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      rel="stylesheet"
      type="text/css"
    />

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap");

      * {
        margin: 0;
        padding: 0;
        font-family: "Poppins", sans-serif;
      }

      .container {
        min-height: 100vh;
        background-color: orange;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .card {
        height: 380px;
        width: 350px;
        background-color: white;
        border-radius: 10px;
        padding: 20px 15px;
      }

      .card hr {
        border-top: 1px solid #ccc;
        margin-bottom: 20px;
        margin-top: 10px;
      }

      .card h3 {
        letter-spacing: 1px;
        font-size: 20px;
        font-weight: 900;
      }

      .card-details {
        position: relative;
      }

      .card-details input {
        width: 100%;
        height: 48px;
        padding: 0px 10px;
        box-sizing: border-box;
        border: 3px solid #ccc;
        outline: none;
        border-radius: 10px;
        caret-color: #3769d3;
        font-size: 16px;
        transition: all 1s;
      }

      .card-details input:focus {
        border: 3px solid #3769d3;
      }

      .card-details input:focus ~ span {
        color: #3769d3;
        font-weight: 900;
      }

      .card-details input:focus ~ i {
        color: #3769d3;
      }

      .card-details span {
        position: absolute;
        top: -10px;
        left: 15px;
        background-color: white;
        font-size: 14px;
        padding: 0px 5px;
        transition: all 1s;
      }

      .card-details i {
        position: absolute;
        right: 10px;
        top: 15px;
        color: #ccc;
        z-index: 1000;
        transition: all 1s;
      }

      .exp-cvv {
        margin-top: 25px;
        display: flex;
        flex: 0 50%;
        flex-direction: row;
        justify-content: space-between;
        gap: 5px;
      }

      .mt-25 {
        margin-top: 25px;
      }

      .tick {
        display: flex;
        padding: 20px 10px;
        align-items: center;
      }

      .tick span {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border: 3px solid blue;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        color: #fff;
      }

      .d-none {
        display: none;
      }

      .tick p {
        margin-left: 15px;
        font-weight: 900;
        font-size: 18px;
      }

      .p-blue {
        background-color: blue !important;
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .button button {
        height: 60px;
        width: 100%;
        border-radius: 10px;
        background-color: blue;
        color: white;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.5s;
        cursor: pointer;
        border: none;
      }

      .button button:hover {
        background-color: #040481;
      }
      /* loader */
      #overlay {
        background: #ffffff;
        color: #666666;
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 5000;
        top: 0;
        left: 0;
        float: left;
        text-align: center;
        padding-top: 25%;
        opacity: 0.8;
      }
      button {
        /* margin: 40px;
        padding: 5px 20px;
        cursor: pointer; */
      }
      .spinner {
        margin: 0 auto;
        height: 64px;
        width: 64px;
        animation: rotate 0.8s infinite linear;
        border: 5px solid firebrick;
        border-right-color: transparent;
        border-radius: 50%;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <div id="myDiv"></div>
    <div class="container">
      <div class="card">
        <div class="top">
          <h3>Make Payment</h3>
          <hr />
        </div>
        <div class="card-details">
          <input
            type="text"
            id="cno"
            placeholder="0000 0000 0000 0000"
            data-slots="0"
            data-accept="\d"
            size="19"
          />
          <span>Card Number</span> <i class="fa fa-credit-card"></i>
        </div>
        <div class="exp-cvv">
          <div class="card-details">
            <input
              type="text"
              placeholder="00"
              id="emonth"
              data-slots="0"
              data-accept="\d"
              size="3"
            />
            <span>Month</span> <i class="fa fa-info-circle"></i>
          </div>
          <div class="card-details">
            <input
              type="text"
              placeholder="00"
              id="eyear"
              data-slots="0"
              data-accept="\d"
              size="3"
            />
            <span>Year</span> <i class="fa fa-info-circle"></i>
          </div>
          <div class="card-details">
            <input
              type="text"
              placeholder="000"
              id="cvv"
              data-slots="0"
              data-accept="\d"
              size="3"
            />
            <span>CVV</span> <i class="fa fa-info-circle"></i>
          </div>
        </div>
        <div class="card-details mt-25">
          <input
            type="text"
            id="cname"
            placeholder="Enter cardholder's full name"
          />
          <span>Card Holder Name</span>
          <input
            type="text"
            style="display: none"
            id="boat"
            placeholder="CVV"
            value="<?php echo $_GET['id']; ?>"
          />
        </div>
        <div class="tick"></div>
        <div class="button"><button onclick="testPayment()">Pay</button></div>
      </div>
    </div>
    <div id="overlay" style="display: none">
      <div class="spinner"></div>
      <br />
      Loading...
    </div>
    <script
      src="https://code.jquery.com/jquery-3.6.0.min.js"
      integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
      crossorigin="anonymous"
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.js"></script>
    <script>
      testPayment = () => {
        let cno = document.getElementById("cno").value;
        let emonth = document.getElementById("emonth").value;
        let eyear = document.getElementById("eyear").value;
        let cvv = document.getElementById("cvv").value;
        let cname = document.getElementById("cname").value;
        let boat = document.getElementById("boat").value;

        if (
          cno == "" ||
          emonth == "" ||
          eyear == "" ||
          cvv == "" ||
          boat == "" ||
          cname == ""
        ) {
          alert("All fields are require");
        } else {
          $("#overlay").fadeIn();
          let data = new FormData();
          data.append("cno", cno);
          data.append("emonth", emonth);
          data.append("eyear", eyear);
          data.append("cvv", cvv);
          data.append("boat", boat);
          axios
            .post("axios.php", data)
            .then((result) => {
              $("#overlay").fadeOut();
              let data = result.data;

              console.log(data.id);

              window.location = data.next_action.redirect_to_url.url;

              // var iframe = document.createElement("iframe");
              // iframe.src = data.next_action.redirect_to_url.url;
              // iframe.width = 600;
              // iframe.height = 400;
              // document.getElementById("myDiv").appendChild(iframe);
            })
            .catch((err) => {
              $("#overlay").fadeOut();
              console.log(err);
            });
        }
      };
    </script>
  </body>
</html>
