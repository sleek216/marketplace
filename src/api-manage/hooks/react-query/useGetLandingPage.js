import MainApi from "../../MainApi";
import {landing_page_api} from "../../ApiRoutes";
import {useQuery} from "react-query";

const getData = async () => {
    const { data } = await MainApi.get(landing_page_api);
    return data;
};

export default function useGetLandingPage() {
    return useQuery("landing-page-data", getData, {
        enabled: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
}