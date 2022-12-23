import os
import json
import requests

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
    res = format_res(requests.get(f"{get_pulumi_output()['endpoint']}/just_do_it"))
    assert res["status"] == 200
    assert res["content"].decode("utf-8")  == "hello"