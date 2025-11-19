import User from "../models/user.js";
import bcrypt from "bcryptjs";

export function createUser(req,res){

	const hashedPassword = bcrypt.hashSync(req.body.password, 10); // Hash the password with a salt round of 10

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword
    })

    user
		.save()
		.then(() => {
			res.json({
				message: "User created successfully",
			});
		})
		.catch(() => {
			res.json({
				message: "Failed to create user",
			});
		});
}

export function loginUser(req,res){
	User.findOne(
		{
			email: req.body.email
		}
	).then(
		(user) => {
			if(user == null){
				res.json({
					message: "User not found"
				})
			}else{
				const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password); // Compare the provided password with the hashed password
				if(isPasswordMatching){
					res.json({
						message: "Login successful"
					})
				}else{
					res.json({
						message: "Incorrect password"
					})
				}
			}
		}
	)
}