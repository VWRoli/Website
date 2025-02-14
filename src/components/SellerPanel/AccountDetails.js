import {React, useState, useEffect} from "react";
import axios from "../../axios";
import {storage} from "../../firebase";
import {nanoid} from "nanoid";

const Verified = {
  user: "verified-user",
  tag: "Verified",
};
const nonVerified = {
  user: "non-verified-user",
  tag: "Not Verified",
};

const style = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 30px",
};

const uploadform = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "20px",
  flexDirection: "column",
};

const AccountDetails = (props) => {
  // all seller profile details here
  const [load, setload] = useState(0);
  const [Photo, setPhoto] = useState(null);
  const [Name, setName] = useState("");
  const [About, setAbout] = useState("");
  const [text, settext] = useState("Update");

  const [Image, setImage] = useState("/images/user.svg");
  const [open, setopen] = useState(false);
  const [sellerDetails, setsellerDetails] = useState({
    Name: props.seller.name,
    Intro: props.seller.intro,
    Photo: props.seller.photo,
    NoOfBooksSold: props.seller.noOfBooksSold,
    Rating: props.seller.rating,
    NoOfRatings: props.seller.noOfRatings,
    NoOfReviews: props.seller.noOfReviews,
    IsVerified: props.seller.isVerified,
    ID: props.seller._id,
    CreatedAt: props.seller.createdAt,
    UpdatedAt: props.seller.updatedAt,
  });

  const handelUpload = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div style={style} id="seller-account-details">
      <div className="card">
        <img
          src={
            sellerDetails.Photo && sellerDetails.Photo.search(".") !== -1
              ? sellerDetails.Photo
              : "images/user.svg"
          }
          alt={sellerDetails.Name}
          width="200px"
        />
        <h1>{sellerDetails.Name}</h1>
        <div className="verify-tag">
          <p
            className={
              sellerDetails.IsVerified ? Verified.user : nonVerified.user
            }
          >
            {sellerDetails.IsVerified ? Verified.tag : nonVerified.tag}
          </p>
        </div>
        <p className="title" style={{marginTop: "10px"}}>
          {" "}
          {sellerDetails.Intro}{" "}
        </p>
        <p className="seller-rating">
          Rating&nbsp;:&nbsp;
          {[...Array(parseInt(sellerDetails.Rating))].map(() => {
            return <i className="fas fa-star"></i>;
          })}
          {[...Array(1)].map(() => {
            if (Number.isInteger(sellerDetails.Rating)) {
              return <i></i>;
            }
            return <i className="fas fa-star-half-alt"></i>;
          })}
          ( {sellerDetails.Rating} )
        </p>
        <p className="books-sold">
          Total Books Sold&nbsp;:&nbsp;<b>{sellerDetails.NoOfBooksSold}</b>
          &nbsp;
        </p>
      </div>
      <div className="update-seller-profile" style={uploadform}>
        <button
          className="update"
          style={{
            fontFamily: "PT Sans",
            fontWeight: "bold",
            letterSpacing: "2px",
            width: "324px",
            borderTop: "2px solid white",
            borderLeft: "2px solid white",
            borderRight: "2px solid white",
            cursor: "pointer",
          }}
          onClick={() => setopen(!open)}
        >
          Update Profile
        </button>
        <form
          action=""
          style={{
            display: open ? "flex" : "none",
            height: open ? "auto" : "none",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            borderBottom: "2px solid white",
            borderLeft: "2px solid white",
            borderRight: "2px solid white",
            transition: "2s",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              flexDirection: "column",
            }}
          >
            <div className="uploaded-images">
              <img src={Image} alt="profile" style={{border: "none"}} />
            </div>
            <div className="upload-btn-wrapper">
              <button>Upload Image</button>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/ico, image/svg"
                onChange={(e) => {
                  handelUpload(e);
                }}
              />
            </div>
          </div>
          <div className="signup-name">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
          </div>
          <div className="signup-name">
            <input
              type="text"
              placeholder="About"
              onChange={(e) => setAbout(e.target.value)}
              value={About}
            />
          </div>
          <button
            style={{
              fontFamily: "PT Sans",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (Name.length > 0 && About.length > 0) {
                settext("Updating...");
                const imageName = nanoid(10) + Photo.name;

                // uploading profile photo to firebase server with unique name
                const uploadTask = storage
                  .ref(`profile/${imageName}`)
                  .put(Photo);
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {},
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    storage
                      .ref("profile")
                      .child(imageName)
                      .getDownloadURL()
                      .then((imgUrl) => {
                        // console.log("imgURL: " + imgUrl);
                        axios
                          .post("/updateSellerProfile", {
                            name: Name,
                            intro: About,
                            photo: imgUrl,
                          })
                          .then((response) => {
                            settext("Successfully Updated!");
                            setTimeout(() => {
                              settext("Update");
                              setName("");
                              setAbout("");
                              setload(!load);
                              setopen(!open);
                            }, 3000);
                          })
                          .catch((error) => {
                            console.log(error.message.data);
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                );
              } else {
                settext("Name/About cannot be empty!");
                setTimeout(() => {
                  settext("Update");
                }, 3000);
              }
            }}
          >
            {text}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AccountDetails;
