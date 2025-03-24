import axios from "axios";

export const Login = async (username: string, password: string) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5233/api/v1/auth/login",
      {
        userName: username,
        password: password,
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
      }
    );
    const user = data;
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    // throw new Error("Login failed");
  }
};

export const UserRole = async (id: string) => {
  const role = await axios.get(
    `http://localhost:5233/api/v1/role-manager/user-roles/${id}`
  );
  const userRole = await role.data;

  return userRole;
};

export const GetUser = async (id: string, authToken: string) => {
  // const response = await axios.get(
  //   `http://localhost:5233/api/v1/user/get?Id=${userId}`
  // );
  // return response.data.result;
  const response = await axios.get("http://localhost:5233/api/v1/user/get", {
    params: { Id: id }, // Pass query parameters here
    headers: {
      Accept: "text/plain", // Set header as in curl request
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};

export const GetAssign = async (formPayload: FormData, authToken: string) => {
  // console.log(formPayload);
  const response = await axios.post(
    `http://localhost:5233/api/v1/assign/get`,
    formPayload,
    {
      // Pass query parameters here
      headers: {
        Accept: "text/plain", // Set header as in curl request
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};

export const GetAllFamilyMember = async (
  formPayload: FormData | null,
  authToken: string
) => {
  // console.log(formPayload);
  const response = await axios.post(
    `http://localhost:5233/api/v1/family-member/getall`,
    formPayload,
    {
      // Pass query parameters here
      headers: {
        Accept: "text/plain", // Set header as in curl request
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  console.log("f", data);
  return data;
};

export const UserRegistration = async (
  formPayload: FormData,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/auth/registration",
    formPayload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response.data;
  return data;
};

// generic function
export const GetAll = async (authToken: string, endPoint: string) => {
  const response = await axios.get(
    `http://localhost:5233/api/v1/${endPoint}/getall`,
    {
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const Get = async (id: number, authToken: string, endPoint: string) => {
  const response = await axios.get(
    `http://localhost:5233/api/v1/${endPoint}/get`,
    {
      params: { Id: id }, // Pass query parameters here
      headers: {
        Accept: "text/plain", // Set header as in curl request
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const Create = async (
  formPayload: FormData,
  authToken: string,
  endPoint: string
) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    `http://localhost:5233/api/v1/${endPoint}/create`,
    formPayload,
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const CreateMulti = async (
  formPayload: FormData,
  authToken: string,
  endPoint: string
) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    `http://localhost:5233/api/v1/${endPoint}/create`,
    formPayload,
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const Update = async (
  formPayload: FormData,
  authToken: string,
  endPoint: string
) => {
  const response = await axios.post(
    `http://localhost:5233/api/v1/${endPoint}/update`,
    formPayload,
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const UpdateMulti = async (
  formPayload: FormData,
  authToken: string,
  endPoint: string
) => {
  const response = await axios.post(
    `http://localhost:5233/api/v1/${endPoint}/update`,
    formPayload,
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const Delete = async (
  id: number,
  authToken: string,
  endPoint: string
) => {
  console.log("top", id);
  const response = await axios.delete(
    `http://localhost:5233/api/v1/${endPoint}/delete`,
    {
      params: { Id: id }, // Pass query parameters here
      headers: {
        Accept: "text/plain", // Set header as in curl request
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};

export const DeleteRange = async (
  ids: string[], // Change id to an array
  authToken: string,
  endPoint: string
) => {
  console.log("Deleting IDs:", ids);

  const response = await axios.delete(
    `http://localhost:5233/api/v1/${endPoint}/delete`,
    {
      data: ids, // Pass the array in the body
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response.data;
  return data; // Directly return response data
};

export const MakeInAcatived = async (
  ids: string[], // Change id to an array
  authToken: string,
  endPoint: string
) => {
  console.log("ids:", ids);

  const response = await axios.post(
    `http://localhost:5233/api/v1/${endPoint}/make-inactive`,
    ids, // Pass the array in the body
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response.data;
  console.log("data:", data);
  return data; // Directly return response data
};
