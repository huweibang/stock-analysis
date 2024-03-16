
import React, { useEffect, useState } from "react"
import ListView from "@/components/ListView/ListView"
import { getStockDetail } from '@/api/index'
import { message } from "antd";
import { UniqueIdentifier } from "@dnd-kit/core";
import { debounce } from '@/utils/index'

interface DataType {
    key: UniqueIdentifier;
    mc: string;
    p: number;
    ud: string;
    id: string;
    pc: string;
    api_code: string;
}

// 自选
const Optional: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [list, setList] = useState<DataType[]>([]);
    // @ts-ignore
    const fs = window.api.moduleFs();

    const getList = async () => {
        const MAX_RETRIES = 3; // 最大重试次数  
        const RETRY_DELAY = 1000; // 重试间隔（毫秒）

        fs.readFile("./self-select-stock.txt", "utf8", async (err, data) => {
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

    // 监听文件变化
    const listen = () => {
        fs.watch("./self-select-stock.txt", debouncedHandler)
    }

    const debouncedHandler = debounce((eventType, filename) => {
        if (eventType == "change" && filename) {
            fs.readFile("./self-select-stock.txt", "utf8", async (err, data) => {
                if (err) return;
                const lastItem = JSON.parse(data)[JSON.parse(data).length - 1]
                const indexDetail = await getStockDetail(lastItem.api_code);
                const newItem = {
                    ...indexDetail,
                    key: JSON.parse(data).length.toString(),
                    mc: lastItem.name,
                    api_code: lastItem.api_code
                };
                setList(list => {
                    return [...list, newItem]
                })
            })
        }
    })

    useEffect(() => {
        getList();
        listen();

        // 清除函数，用于在组件卸载时停止监视  
        return () => {  
            fs.unwatchFile("./self-select-stock.txt", debouncedHandler);  
        }; 
    }, [])

    return (
        <div>
            {contextHolder}
            <ListView data={list}></ListView>
        </div>
    )
}

export default Optional