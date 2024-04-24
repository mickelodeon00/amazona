import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          image: user.image,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(404).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const { name, email, password } = req.body;
    if (!user) {
      const createdUser = await User.create({
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
      });
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    } else
      res
        .status(404)
        .send({ message: 'This email is already associated with an account' });
  })
);
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email, image, password } = req.body;
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (image) user.image = image;
      if (password) user.password = bcrypt.hashSync(password);

      try {
        const updatedUser = await user.save();
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          image: updatedUser.image,
          token: generateToken(updatedUser),
        });
      } catch (err) {
        res.status(500).send({ message: 'User update failed' });
      }
    } else res.status(404).send({ message: 'User not found' });
  })
);

export default userRouter;
