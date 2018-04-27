namespace UI {

    const iconFile: string = "data:image/png;base64,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";
    const iconFolder: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gQbAwsHmhaURgAABQdJREFUeNrt3c2PHnUBwPHvdtdSE6smVKUYBONBjMdejGkFRBrjxXgzGv4BQIuScADFejIaBeLLzZPI1Zd4UCNqjNEYE26ilAMqL1XaGjQNtprCenieTUp3F5zZ1e4+8/kkE9KHmdnm98x35zfPzG4LAAAAAAAAAAAAAAAAAAAAAAAAgB1tacQ2y9Xh6qbqUHV9dWX1xpH7WwQ/qj5SnXdITddbqy9Vf6lWLeuWH1b7HCbT8/rq/vl3RyGIhIvcWD3jwBcJ6x2rLjjgRcJ6xx3kImHzM4cDXCRs4AbTqm1ffly91qG1GJ9WuSB3JmET9zuQRcLGDlbnHMSmW7zcnvl/P+W72//F0eo7xnr3WKpWqqerq0bu43T1k4uuXxbdh5s9f7YVnt3aZZ9cjZkunGv2kfDeiY3XW6rfuyaZjuMj4zg84TETyYT8YMQbe8ywiWQqnhj4hp6a4LRKJBP2/MA382FDJpIpGfpoyRcMmUimYk+zH6Ed4l+GbZ3nmv3szO+2uJ8PVt/PzcQdFQjb41R18zZEcrT6nkgEIhKRCEQkIhEIIhEIIpmeFUPwP4/kA9XPq3dtMZJ/Gs7/2mr19+pMdaJ6tPpZ9avqxTE7G7IcN/6Dbdd9EsvWlpPVF6urTbF2luea/arWPxiKy+pgdXf1ZPXlar9ARMJ6V1R3VY9VRwQiEjZ2zfza5A6BiISNrVRfq+4TiEjY3Oc3OpMI5PJGcmNbv0/C9nng0msSgVxea/dJnEl2znTr4ep1AjHdYvML9/sEYrrF5j7R/GaiQEy3WG9f9cm1ORc7b7p1Z9P9B1G3w9J8qnRLdWDkPm6t7i3PYrG49s6/2Yz9vdOHTbFYZP+uHmz2NPSY36XwfoEwBb+s7hmx3SGBMBVfb/bzIUO8UyBMabr1yMBt3iwQpuRPA9ffLxCmZOiF+opA4BUIBAQCAgGBgEBAICAQEAgIBAQCCAQEAgIBgYBAQCAgEBAICAQEAggEBAICAYGAQEAgIBAQCAgEEAgIBAQCAgGBgEBAICAQEAgIBBAICAQEAgIBgYBAQCAgEBAIIBAQCAgEBAICAYGAQEAgIBAQCCAQEAgIBAQCAgGBgEBAICAQQCAgEBAICAQEAgIBgYBAQCAgEEAgIBAQCAgEBAICAYGAQGBCgbw4cJsrDBu71NBj98Ke6uzAja41zuxS1w1c/2zVE9XqgOV0tddYswvPHmcGHuuP76lODPxCB6rbjDe7zB3VlQO3OVH1uYFVrVbnqiPGnF3ihur8iOP8s1XvG7Hh6vwLftp0ix1sb3XXyDhWq/cuVcvV09XBkX+JM9Uj1R+rf3hP2AHeUL29umXEtGrNM9W1K80+5n2ounvkjg5UH/WesGAeql5amv/hqvkZYJ9xgc5X76hOrt1J/2v1DeMCVT1YnaxauujF/dVj1TXGhwn7c/Xu6oV6+bNYZ6uPVxeMERN1Yd7AC2svLF+ywlPV89WHjBUTdHv13YtfWN5gpd82+wz4JuPFhHymeuDSF5c3WfkX1d+qo3kknsWfVt2+URyXXqRv5Ej17eptxpEFvSD/WPXrzVZYfpUdPFV9s3pNdahaMaYsgHPVV5rd4H7ylVZcGrDTg9Wx6tbqamPMLvRs9a3qq83u/b2qpRFfZLl6T3Xz/KxyffWmZs+/uF5hJ3ip2XOBp6rHq0ern1a/mf8/AAAAAAAAAAAAAAAAAAAAAAAAABbFfwBIglI4EZwPDAAAAABJRU5ErkJggg==";

    /**
     * 进行UI处理的代码部分
    */
    export function showFiles(files: UploadFile[]): Object[] {

        // 在完成了文件的拖拽之后，会使用这个函数来处理UI界面的变化
        // 拖拽完成之后会将初始页面进行隐藏，然后显示出上传进度页面
        $("#initial-scale").hide();
        $("#progress-scale").show();

        // 将文件显示在进度页面之上
        // 每一个文件对象都是一个root节点
        var trees: Object[] = [];
        
        console.log("View from UI builder:");
        console.log(files);
        console.log("Build for jstree...");

        files.forEach(file => {
            trees.push(jsTree(file));
        });

        // 会在进度条列表之中显示出多个树
        return trees;
    }

    /**
     * 这个函数按照jstree.js模块之中所要求的规则生成文件树的json数据模型
     * 直接可以直接将这个结果应用于jsTree模块之中即可创建树
     * 
     * @description https://www.jstree.com/demo/
    */
    function jsTree(file: UploadFile): Object {
        return {
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": { "stripes": true },
                "data": jsTreeData(file)
            },
            "types": {
                // root node
                "#": {
                    "max_children": 1,
                    "max_depth": 4,
                    "valid_children": ["root"]
                },
                "root": {
                    "icon": iconFolder,
                    "valid_children": ["default"]
                },
                "default": {
                    "icon": iconFolder,
                    "valid_children": ["default", "file"]
                },
                "file": {
                    "icon": iconFile,
                    "valid_children": []
                }
            }
        };
    }

    /**
     * 构建jstree的数据模型
     * 
     * @param file root节点
    */
    function jsTreeData(file: UploadFile): Object {

        console.log(file);

        if (file.type == fileObjectTypes.file) {
            // 只有这个当前的root节点
            return {
                id: file.name,
                text: file.name,
                type: "file"
            };
        } else {
            // 可能会存在多个子节点
            // 需要对树进行递归
            var childs: Object[] = [];

            console.log("Childs of this file:");
            console.log(file.childs);
            console.log(file);

            // do {
            //     if (file.childs && file.childs.length >= 0) {
            //         break;
            //     }
            // } while(true);

            file.childs.forEach(node => {
                return jsTreeData(node);
            });

            return {
                "id": file.name,
                "text": file.name,
                "children": childs,
                "type": "default"
            };
        }
    }
}