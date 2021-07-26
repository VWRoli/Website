import {React, useState} from "react";
const GetOrderDetails = (props) => {
  return (
    <div className="god-cont">
      <button
        type="submit"
        className="findprofile-email-button"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Fetch Orders List / Update
      </button>
      <br />
      <h1>Or</h1>
      <br />
      <div className="god-search">
        <form action="">
          <input
            type="text"
            className="god-search-id"
            placeholder="Enter Order Id"
          />
          <button
            type="submit"
            className="god-search-button"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Find
          </button>
        </form>
      </div>
      <div className="god-table">
        <table>
          <tr>
            <th>Seller</th>
            <th>Customer</th>
            <th>Order Details</th>
            <th>Track Order</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default GetOrderDetails;