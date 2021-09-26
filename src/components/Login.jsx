import React from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';

import useAuth from '../hooks/index';
import routes from '../routes';
import { authorizeUser } from '../utils';

const LoginPage = () => {
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();
    
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values, { setFieldError }) => {
          try {
            await authorizeUser({
              auth, history, from,
              url: routes.loginPath(),
              username: values.username,
              password: values.password,
            });
          }
          catch (e) {
            console.log(e);
            setFieldError('password', 'Invalid password or username');
          }
        },
    });

    const { from } = location.state || { from: { pathname: "/" } };
  
    return (
      <div className="container-fluid">
        <div className="row justify-content-center pt-5">
          <div className="col-sm-4">
            <Form className="p-3" onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  isInvalid={formik.errors.password || false}
                  autoComplete="username"
                  required={true}
                  placeholder="username"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={formik.errors.password || false}
                    autoComplete="password"
                    required={true}
                    placeholder="password"
                    type="password"
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
                >{formik.isSubmitting ? 'Submitting…' : 'Submit'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  export default LoginPage;
