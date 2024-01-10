import axios from 'axios';

const baseURL: string = 'https://bwptestpapers.com/api/';
export const Image_Base_Url = 'https://bwptestpapers.com/public/'

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//login user api call with email and password manadatory
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('login', {
      email: email,
      password: password,
    });
    return response;
  } catch (error: any) {
    console.log('API::LOGIN::ERROR', error);
    throw error;
  }
};

//logout user api call with token manadatory
export const logoutUser = async (token: string) => {
  try {
    const response = await api.get('logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::LOGOUT::ERROR', error);
    throw error;
  }
};

//register user api call with email and password manadatory
export const register = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: number;
}) => {
  try {
    const response = await api.post('register', {
      name: name,
      email: email,
      password: password,
      role: role,
    });
    return response;
  } catch (error: any) {
    console.log('API::REGISTER::ERROR', error);
    throw error.message;
  }
};

//fetch the classes to display if user is logged in with token manadatory
export const getClasses = async (token: string) => {
  try {
    const response = await api.get('class', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::CLASSES::ERROR', error);
    throw error;
  }
};

//fetch the subjects to display if user is logged in with token manadatory
export const getSubjects = async (token: string, classId: string | undefined | Number) => {
  try {
    const response = await api.get(`subject/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::SUBJECTS::ERROR', error);
    throw error;
  }
};

//fetch the AnswerKey to display if user is logged in with token manadatory
export const getPdfs = async ( token: string | null, classId: string, subjectId: string ) => {
  try {
    const response = await api.get(`pdf/${classId}/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::PDFS::ERROR', error);
    throw error;
  }
};

//fetch the Videos to display if user is logged in with token manadatory
export const getVideos = async ( token: string | null, classId: string, subjectId: string ) => {

  try {
    const response = await api.get(`video/${classId}/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::VIDEOS::ERROR', error);
    throw error;
  }
};

//fetch the Ebooks to display if user is logged in with token manadatory
export const getEbooks = async (token: string | null, classId: string, subjectId: string ) => {
  try {
    const response = await api.get(`book/${classId}/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log('API::EBOOKS::ERROR', error);
    throw error;
  }
};

export const changePassword = async ( token: string | null, oldPassword: string, newPassword: string ) => {
  try {
    const response = await api.post(
      'profile/change-password',
      {
        current: oldPassword,
        new: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.log('API::CHANGE_PASSWORD::ERROR', error);
    throw error;
  }
};

export const updateProfile = async ( token: string | null, userId: Number, updatedProfile: FormData ) => {

  try {
    const response = await api.post(`update/${userId}`, updatedProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log('API::UPDATE_PROFILE::ERROR', error);
    throw error;
  }
};

export const getProfile = async (token: string | null, userId: Number) => {
  try {
    const response = await api.get(`user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API::PROFILE::ERROR', error);
  }
};

export const getAllSchools = async (token : string | null ) => {
  try {
    const response = await api.get('school',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;

  }catch (error) {
    console.log('API::SCHOOLS:ERROR',error);
  }
} 

export const getPrice = async (token : string | null, classId : string | number, subjectId: string | number) => {
  
  try {
    const response = await api.get(`order/get-price/${classId}/${subjectId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;

  }catch (error) {
    console.log('API::PRICE:ERROR',error);
  }
}

export const addSchool = async (token : string | null, schoolData:FormData) => {
  try {
    const response = await api.post('school/store',schoolData,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;

  }catch (error) {
    console.log('API::ADD_SCHOOL:ERROR',error);
  }
}

export const getOrder = async (token : string | null ) => {
  try {
    const response = await api.get('order',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API::GET::ORDER:ERROR',error);
  }
}

export const sendRemarks = async (token : string | null, vendorId: string | number,userID : string | null ,remarks: string) => {
  try {
    const response = await api.post('school/report/store',{
      vendor_id: vendorId,
      user_id: userID,
      remark: remarks
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API::SEND::REMARKS:ERROR',error);
  }
}

export const editSchool = async (token : string | null, id : string | number, schoolData:FormData) => {
  try {
    const response = await api.post(`school/update/${id}`,schoolData,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;

  }catch (error) {
    console.log('API::EDIT_SCHOOL:ERROR',error);
  }
}