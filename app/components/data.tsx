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

export const GetAllUser = async (authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/user/getall", {
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
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

//Category
export const GetAllCategory = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/category/getall",
    {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const GetCategory = async (id: number, authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/category/get",
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
export const CreateCategory = async (
  name: string,
  price: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/category/create",
    { name: name, price: price, active: active },
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
export const UpdateCategory = async (
  id: number,
  name: string,
  price: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/category/update",
    { Id: id, name: name, price: price, active: active },
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

// Division
export const GetAllDivision = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/division/getall",
    {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const GetDivision = async (id: number, authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/division/get",
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
export const CreateDivision = async (
  name: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/division/create",
    { name: name, active: active },
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
export const UpdateDivision = async (
  id: any,
  name: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/division/update",
    { Id: id, name: name, active: active },
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
// District
export const GetAllDistrict = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/district/getall",
    {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${authToken}`, // Include token here
      },
    }
  );
  const data = await response.data;
  return data;
};
export const GetDistrict = async (id: number, authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/district/get",
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
export const CreateDistrict = async (
  name: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/district/create",
    { name: name, active: active },
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
export const UpdateDistrict = async (
  id: any,
  name: string,
  active: string,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/district/update",
    { Id: id, name: name, active: active },
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
// Area
export const GetAllArea = async (authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/area/getall", {
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const GetArea = async (id: number, authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/area/get", {
    params: { Id: id }, // Pass query parameters here
    headers: {
      Accept: "text/plain", // Set header as in curl request
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const CreateArea = async (formPayload: FormData, authToken: string) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    "http://localhost:5233/api/v1/area/create",
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
export const UpdateArea = async (formPayload: FormData, authToken: string) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/area/update",
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

// Renter
export const GetAllRenter = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/renter/getall",
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
export const GetRenter = async (id: number, authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/renter/get", {
    params: { Id: id }, // Pass query parameters here
    headers: {
      Accept: "text/plain", // Set header as in curl request
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const CreateRenter = async (
  formPayload: FormData,
  authToken: string
) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    "http://localhost:5233/api/v1/renter/create",
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
export const UpdateRenter = async (
  formPayload: FormData,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/renter/update",
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
// House
export const GetAllHouse = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/house/getall",
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
export const GetHouse = async (id: number, authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/house/get", {
    params: { Id: id }, // Pass query parameters here
    headers: {
      Accept: "text/plain", // Set header as in curl request
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const CreateHouse = async (formPayload: FormData, authToken: string) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    "http://localhost:5233/api/v1/house/create",
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
export const UpdateHouse = async (formPayload: FormData, authToken: string) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/house/update",
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

// Family Member
export const GetAllFamilyMember = async (authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/family-member/getall",
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
export const GetFamilyMember = async (id: number, authToken: string) => {
  const response = await axios.get(
    "http://localhost:5233/api/v1/family-member/get",
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
export const CreateFamilyMember = async (
  formPayload: FormData,
  authToken: string
) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    "http://localhost:5233/api/v1/family-member/create",
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
export const UpdateFamilyMember = async (
  formPayload: FormData,
  authToken: string
) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/family-member/update",
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

// Family Member
export const GetAllFlat = async (authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/flat/getall", {
    headers: {
      Accept: "text/plain",
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const GetFlat = async (id: number, authToken: string) => {
  const response = await axios.get("http://localhost:5233/api/v1/flat/get", {
    params: { Id: id }, // Pass query parameters here
    headers: {
      Accept: "text/plain", // Set header as in curl request
      Authorization: `Bearer ${authToken}`, // Include token here
    },
  });
  const data = await response.data;
  return data;
};
export const CreateFlat = async (formPayload: FormData, authToken: string) => {
  console.log("gg", formPayload);
  const response = await axios.post(
    "http://localhost:5233/api/v1/flat/create",
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
export const UpdateFlat = async (formPayload: FormData, authToken: string) => {
  const response = await axios.post(
    "http://localhost:5233/api/v1/flat/update",
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

  return response.data; // Directly return response data
};
