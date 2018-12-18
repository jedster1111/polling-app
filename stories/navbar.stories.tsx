// import { action } from "@storybook/addon-actions";
// import { storiesOf } from "@storybook/react";
// // import { Menu } from "antd";
// import "antd/dist/antd.css";
// import * as React from "react";
// import { MemoryRouter } from "react-router-dom";
// import NavBarButton from "../src/app/components/navbar/AuthButtons";
// import Navbar from "../src/app/components/navbar/Navbar";

// const userData = {
//   id: "1",
//   photos: [{ value: "https://avatars2.githubusercontent.com/u/25291974?v=4" }],
//   userName: "Jed"
// };
// storiesOf("Navbar", module)
//   .addDecorator(story => (
//     <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
//   ))
//   // .add("Login/Logout Button", () => (
//   //   <React.Fragment>
//   //     <NavBarButton type="Login" handleClick={loggedIn()} />
//   //     <NavBarButton type="Logout" handleClick={loggedOut()} />
//   //   </React.Fragment>
//   // ))
//   .add("Navbar", () => (
//     <React.Fragment>
//       <Navbar
//         layout="horizontal"
//         isLoggedIn={false}
//         userData={userData}
//         handleGithubLogin={loggedIn()}
//         handleLogout={loggedOut()}
//         location={"/"}
//         isLoading={false}
//       />
//       <Navbar
//         layout="horizontal"
//         isLoggedIn={true}
//         userData={userData}
//         handleGithubLogin={loggedIn()}
//         handleLogout={loggedOut()}
//         location={"test"}
//         isLoading={true}
//       />
//     </React.Fragment>
//   ));

// function loggedOut(): () => void {
//   return action("Logged  out!");
// }
// function loggedIn(): () => void {
//   return action("Logged in!");
// }
