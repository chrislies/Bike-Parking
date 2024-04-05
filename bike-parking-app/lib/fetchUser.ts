import { SupabaseClient } from "@supabase/supabase-js";

export const fetchUser = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", user.id);

    if (data && data.length > 0) {
      console.log(data[0]);
      return data;
    } else {
      return null;
    }
  } catch (error) {
    alert(error);
    return null;
  }
};
