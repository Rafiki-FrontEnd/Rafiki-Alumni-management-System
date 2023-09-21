import { Autocomplete, TextField } from "@mui/material/node";
import { createFilterOptions } from "@mui/material/node/Autocomplete";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { updateJobSkillIds } from "../../redux/actions/jobsActions";
import Toast from "../Toast";

const JobSkillsSelect = () => {
	const [skills, setSkills] = useState([{ label: "", id: "" }]);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const dispatch = useDispatch();

	const sessionId = localStorage.getItem("sessionId");
	const filter = createFilterOptions();

	const handleSkillChange = (event, newValue) => {
		setSelectedSkills(newValue);
		const selectedSkillsIds = newValue.map((skill) => skill.id);
		updateJobSkillIds(dispatch, selectedSkillsIds);

		// Check if each selected skill already exists, and add it if it doesn't
		newValue.forEach((skill) => {
			const isSkillExisting = skills.some(
				(existingSkill) => existingSkill.label === skill.label
			);
			if (!isSkillExisting) {
				addUnExistingSkill(skill.label);
			}
		});
	};

	const addUnExistingSkill = (skillName) => {
		fetch("https://rafiki-backend.azurewebsites.net/api/skills/", {
			method: "POST",
			body: JSON.stringify({
				Skill_Name: skillName,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionId}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Add Skill failed");
				}
				return res.json();
			})
			.then((data) => {
				if (data.success) {
					console.log("done", data.message);
				} else {
					console.log("error", data.message);
				}
			})
			.catch((err) => Toast({ title: err.message, icon: "error" }));
	};

	const getSkills = () => {
		fetch("https://rafiki-backend.azurewebsites.net/api/skills/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionId}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Upload failed");
				}
				return res.json();
			})
			.then((data) => {
				if (data.success) {
					let skills = data.skills.map((e) => ({
						label: e.Skill_Name,
						id: e.Skill_Id,
					}));

					setSkills(skills);
				}
			});
	};

	useEffect(() => {
		getSkills();
	}, []);

	return (
		<>
			<Autocomplete
				multiple
				id="tags-outlined"
				options={skills}
				getOptionLabel={(option) => option.label}
				value={selectedSkills} // Set the selected skills
				onChange={handleSkillChange} // Update selected skills on change
				filterSelectedOptions
				renderInput={(params) => (
					<TextField
						{...params}
						label="Required Skills"
						placeholder="Enter Skill"
						name="Job_Skill"
					/>
				)}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);

					const { inputValue } = params;
					// Suggest the creation of a new value
					const isExisting = options.some(
						(option) => inputValue === option.label
					);
					if (inputValue !== "" && !isExisting) {
						filtered.push({
							label: capitalizeFirstLetter(inputValue),
						});
					}

					return filtered;
				}}
			/>
		</>
	);
};

export default JobSkillsSelect;
