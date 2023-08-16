import { useEffect, useState } from "react";
import Backbtn from "../components/Backbtn";
import ProfileAboutSec from "../components/ProfileAboutSec";
import ProfileCV from "../components/ProfileCV";
import ProfileContactInfoSec from "../components/ProfileContactInfoSec";
import ProfileEdu from "../components/ProfileEdu";
import ProfileExperience from "../components/ProfileExperiece";
import ProfileImg from "../components/ProfileImg";
import ProfileJobTitle from "../components/ProfileJobTitle";
import ProfileName from "../components/ProfileName";
import ProfilePersonalInfo from "../components/ProfilePersonalInfo";
import ProfileSkills from "../components/ProfileSkills";
import ProfileURLsSec from "../components/ProfileURLsSec";
import ProfileUsername from "../components/ProfileUsername";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.css";
import GenerateCV from "../components/GenerateCV";
import { updateUserInfo } from "../redux/actions/profileActions";
import { useNavigate } from "react-router-dom";
import { RedirectToLoginNotification } from "../components/RedirectToLoginNotification";
import fetchUserData from "../utils/fetchUserData";
import Logo from "../components/Logo";

const AlumniProfile = () => {
	const sessionId = localStorage.getItem("sessionId");
	const userInfo = useSelector((state) => state.userInfo);
	const [profileFetched, setProfileFetched] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Make API request and update user Info in the Redux store
	const fetchUserData = async () => {
		try {
			const response = await fetch(
				"https://alumni-system-backend.azurewebsites.net/api/users",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionId}`,
					},
				}
			);

			if (response.status === 401) {
				// Redirect to login page
				RedirectToLoginNotification();
				navigate("/login");
			} else {
				const data = await response.json();
				if (data.success === true) {
					updateUserInfo(dispatch, data);
					setProfileFetched(true);
				}
			}
		} catch (error) {
			console.log("Error while fetching profile data:", error);
		}
	};
	// fetchUserData(sessionId, dispatch, navigate, setProfileFetched);

	useEffect(() => {
		if (!profileFetched) {
			fetchUserData();
			// fetchUserData(sessionId, dispatch, navigate, setProfileFetched);
		}
	}, [profileFetched]);
	return (
		userInfo &&
		userInfo.user && (
			<div className="AlumniProfile profile">
				<div className="container">
					<Logo to={`/dashboard?username=${userInfo.user.UserName}`} />
					<div className="my-5 d-flex justify-content-center align-items-center">
						<div>
							<ProfileImg profileData={userInfo.user} />
						</div>
						<div className="d-flex flex-column justify-content-center align-items-center ms-5">
							<div className="order-md-1 order-2 w-100">
								<ProfileUsername username={userInfo.user.UserName} />
							</div>
							<div className="order-md-2 order-1">
								<ProfileName
									firstName={userInfo.user.FirstName}
									lastname={userInfo.user.LastName}
								/>
							</div>
							<div className="order-md-3 order-3 w-100">
								<ProfileJobTitle />
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-12 col-md-6">
							<ProfileURLsSec profileData={userInfo.user} />
						</div>

						<div className="col-12 col-md-6">
							<ProfileCV cv={userInfo.user.CV} />
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfileAboutSec aboutContent={userInfo.user.About} />
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfileContactInfoSec
								phonePram={userInfo.user.Phone}
								emailPram={userInfo.user.Email}
							/>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfileSkills />
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfileExperience />
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfileEdu actor={"Alumni"} />
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ProfilePersonalInfo countryPram={userInfo.user.Country} />
						</div>
					</div>
				</div>
			</div>
		)
	);
};

export default AlumniProfile;
