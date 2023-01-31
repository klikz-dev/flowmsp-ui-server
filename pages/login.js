// import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  // const dispatch = useDispatch();
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (event) => {
    if (event.target.name === "email") {
      setCredentials({ ...credentials, email: event.target.value });
    }
    if (event.target.name === "password") {
      setCredentials({ ...credentials, password: event.target.value });
    }
  };

  const getLink = (links, rel) => {
    return links.filter(function (obj) {
      return obj.rel === rel;
    })[0];
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await axios.post("/api/customer/login", {
        credentials: credentials,
      });

      sessionStorage.setItem("jwt", response.data.accessToken);
      sessionStorage.setItem(
        "customer",
        JSON.stringify(getLink(response.data.links, "customer"))
      );
      sessionStorage.setItem(
        "user",
        JSON.stringify(getLink(response.data.links, "user"))
      );
      sessionStorage.setItem("tokenType", response.data.tokenType);
      sessionStorage.setItem(
        "customerID",
        JSON.stringify(getLink(response.data.links, "customerID"))
      );

      const customerHref = getLink(response.data.links, "customer").href;
      const organization = customerHref.split("/")[4];

      router.push("/" + organization);
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid credentials!");
    }
  };

  const handleForgotPassword = (event) => {};

  const handleCreateAccountClick = (event) => {};

  return (
    <div className="container login-container">
      <div className="col-md-12 login-wrapper">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="panel panel-login">
              <div className={isLoggingIn ? "loader" : "visibility-hidden"} />

              <div className="panel-heading">
                <div className="col-lg-12">
                  <h3>FlowMSP Sign in</h3>
                  <p>Enter your FlowMSP login information below</p>
                </div>
                <hr />
              </div>

              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-12">
                    <p>{errorMessage}</p>

                    <form
                      id="login-form"
                      action="#"
                      method="post"
                      onSubmit={onSubmit}
                    >
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          value={credentials.email}
                          className="form-control"
                          placeholder="Username"
                          onChange={onChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={credentials.password}
                          placeholder="Password"
                          onChange={onChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="submit"
                          className="btn btn-lg btn-block btn-login"
                          value="Login"
                          disabled={isLoggingIn}
                        />
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="text-center">
                              <a
                                href="#"
                                className="forgot-password"
                                onClick={handleForgotPassword}
                              >
                                Forgot Password?
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="panel-account">
              <div className="col-lg-12">
                <h3>Not currently a FlowMSP customer?</h3>
                <button
                  type="button"
                  className="btn btn-login"
                  onClick={handleCreateAccountClick}
                >
                  Create your FlowMSP account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
