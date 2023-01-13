import os
import json
import requests
import pytest
import logging


def access_token():
    username = "kingster307"
    pw = "kingster_test"
    requests.get("http://localhost:3001/login", params={"username": username, "pw": pw})
    token = format_res(requests.get("http://localhost:3001/access_token", {}))["content"].decode("utf - 8")
    requests.get("http://localhost:3001/logout", {})
    return token

def format_res(resp) -> dict:
    resp_dict = {
        "status": resp.status_code,
        "url": resp.url,
        "redirect": resp.is_redirect,
        "headers": resp.headers,
    }
    try:
        resp_dict["content"] = json.loads(resp.content)
        resp_dict["links"] = resp.links
    except Exception:
        resp_dict["content"] = resp.content

    return resp_dict

def get_pulumi_output():
    with open("../pulumi_output.json", "rb") as read_file:
        return json.load(read_file)

def test_test():
    logging.info(get_pulumi_output()['endpoint'])
    res = format_res(requests.get(f"{get_pulumi_output()['endpoint']}/just_do_it", headers={"Authorization": f"Bearer {access_token()}"}))
    print(res)
    assert res["status"] == 200
    assert res["content"].decode("utf-8")  == "hello"