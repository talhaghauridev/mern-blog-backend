import axios from "axios";

type Profile = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  name: string;
  picture: string;
  verified_email: boolean;
};

type ProfileResponse = { user: Profile | null; error: any | null };

async function getGoogleProfile(
  access_token: string
): Promise<ProfileResponse> {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
          accept: "application/json",
        },
      }
    );
    console.log({ res });

    return { user: res.data, error: null };
  } catch (error: any) {
    console.error(
      "Error fetching Google profile:",
      error.response ? error.response.data : error.message
    );
    return {
      error: error.response ? error.response.data : error.message,
      user: null!,
    };
  }
}

export default getGoogleProfile;
