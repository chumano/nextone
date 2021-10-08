import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../utils";
import { UserAction, UserActionTypes } from "./userActions";
import { IUserStore } from "./userStore";



// const usersReducer = (state = initialState, action : UserAction) => {
//   const { type, payload } = action;

//   switch (type) {
//     case UserActionTypes.CREATE:
//       return [...state.users, payload];

//     case UserActionTypes.GET:
//       return payload;

//     case UserActionTypes.UPDATE:
//       return users.map((user) => {
//         if (user.id === payload.id) {
//           return {
//             ...user,
//             ...payload,
//           };
//         } else {
//           return user;
//         }
//       });

//     case UserActionTypes.DELETE:
//       return users.filter(({ id }) => id !== payload);


//     default:
//       return users;
//   }
// };



