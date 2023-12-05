import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getTimeTrackerApi(): any {
    return api.get(URL.getTimeTracker)
}
