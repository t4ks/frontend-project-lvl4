import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import useAuth from '../hooks/index';
import routes from '../routes';
import { authorizeUser } from '../utils';


const SignupSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Not less than 3 symbols!')
    .max(20, 'Not more than 20 symbols')
    .required(),
  password: yup.string().min(6, 'The password can not be less than 6 symbols').required(),
  confirmPassword: yup.string().required(),
});

const SignUp = () => {
  const history = useHistory();
  const location = useLocation();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'The password confirmation field must be the same with the password field');
        return setSubmitting(false);
      }

      try {
        await authorizeUser({
          auth, history, from,
          url: routes.signUpPath(),
          username: values.username,
          password: values.password,
        });
      } catch(e) {
        console.log(e);
        if (e.response && e.response.status === 409) {
          setFieldError('username', 'The user already exist')
        } else {
          setFieldError('username', 'The registration failed');
        }
      }
      setSubmitting(false);
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
                isInvalid={formik.errors.username && formik.touched.username || false}
                autoComplete="username"
                required={true}
                placeholder="username"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  isInvalid={formik.errors.password && formik.touched.password || false}
                  autoComplete="password"
                  required={true}
                  placeholder="password"
                  type="password"
                />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
              <Form.Control
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword || false}
                  autoComplete="confirmPassword"
                  required={true}
                  placeholder="Confirm Password"
                  type="password"
                />
              <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
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


export default SignUp;