import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Router,
} from "react-router-dom";
import UploudPage from "./pages/UploadPage";

function Routes() {
  return (
    <BrowserRouter>
      <Router>
        <Route element={<UploudPage />} path="/upload" />
        <Route path="/" element={<Navigate to="/upload" replace />} />
      </Router>
    </BrowserRouter>
  );
}

export default Routes;
