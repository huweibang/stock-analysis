
import React, { useEffect, useState } from "react"
import ListView from "@/components/ListView/ListView"
import { getStockDetail } from '@/api/index'
import { message } from "antd";
import { stockFlag, debounce } from '@/utils/index';
import { ParentContext } from '@/utils/context';

interface DataType {
    key: string;
    mc: string;
    p: number;
    ud: string;
    id: string;
    pc: string;
    api_code: string;
    zf: string;
    line: string;
}

// 自选
const Optional: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [list, setList] = useState<DataType[]>([]);
    const fs = window.api.moduleFs();

    const getList = async () => {
        const MAX_RETRIES = 3; // 最大重试次数  
        const RETRY_DELAY = 1000; // 重试间隔（毫秒）

        fs.readFile(localStorage.stockUrl, "utf8", async (err, data) => {
            if (err) {
                messageApi.open({
                    type: 'error',
                    content: '列表读取失败！',
                });
            } else {
                const arr = JSON.parse(data)
                const pro = arr.map(async (item, index) => {
                    let retryCount = 0;
                    let indexDetail;
                    while (retryCount < MAX_RETRIES) {
                        try {
                            indexDetail = await getStockDetail(item.api_code);
                            break; // 请求成功，跳出循环  
                        } catch (error) {
                            retryCount++;
                            if (retryCount < MAX_RETRIES) {
                                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // 等待一段时间后重试  
                            } else {
                                throw "重试完成"; // 达到最大重试次数，抛出错误  
                            }
                        }
                    }
                    return { ...indexDetail, key: index.toString(), mc: item.name, api_code: item.api_code };
                })

                const optionList = await Promise.all(pro);
                setList(optionList)
            }
        })
    }

    // 获取移动后的list
    const handleMoveList = (arr: DataType[]) => {
        setList(arr)
    }

    // 监听文件变化
    const listen = () => {
        fs.watch(localStorage.stockUrl, debouncedHandler)
    }

    const debouncedHandler = debounce((eventType: string, filename: string) => {
        if (eventType == "change" && filename) {
            if (localStorage.isUpData == 1) {
                fs.readFile(localStorage.stockUrl, "utf8", async (err, data) => {
                    if (err) { console.log("读取失败"); return };
                    localStorage.isUpData = 0;
                    const lastItem = JSON.parse(data)[JSON.parse(data).length - 1];
                    const indexDetail = await getStockDetail(lastItem.api_code);
                    const newItem = {
                        ...indexDetail,
                        key: "9999",
                        mc: lastItem.name,
                        api_code: lastItem.api_code
                    };
                    setList(list => {
                        let mergeArr = [...list, newItem];
                        mergeArr.map((item, index) => item.key = index.toString());
                        return mergeArr;
                    })
                })
            }
        }
    })

    const execute = () => {
        getList()
        return execute;
    }

    useEffect(() => {
        const flag = stockFlag();
        // 每30秒更新一次
        // flag ? setInterval(execute() , 30000) : execute();
        getList();
        listen();

        // 清除函数，用于在组件卸载时停止监视  
        return () => {
            fs.unwatchFile(localStorage.stockUrl, debouncedHandler);
        };
    }, [])

    return (
        <div>
            {contextHolder}
            <ParentContext.Provider value={true}>
                <ListView data={list} getMoveList={handleMoveList}></ListView>
            </ParentContext.Provider>
        </div>
    )
}

export default Optional