# Localstack Authorizer issue

## Getting started
1) run `make all`
   1) make all will build everything, install deps, and run test
      1) test will say pass since we aren't checking any returns
   2) flow of test 
      1) hit apigw route that requires authorization
      2) route should return 'hello'

2) run `make cleanup` for a fresh start

## Issue
getting 'Authorizer' object is not subscriptable' when route is hit

Tests [here](./tests/route_test.py)
