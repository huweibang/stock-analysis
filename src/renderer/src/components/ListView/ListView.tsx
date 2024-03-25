import React, { useEffect, useState } from 'react';
import { Table, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnsType } from 'antd/es/table';
import "@/assets/styles/ListView.scss"
import { useContext } from 'react';
import { ParentContext } from '@/utils/context';
import { useNavigate } from 'react-router-dom';

interface DataType {
    zf: string;
    key: UniqueIdentifier;
    mc: string;
    p: number;
    pc: string;
    ud: string | number;
    id: string;
    api_code: string;
}
// 定义props的类型 
interface ListViewProps {
    data: DataType[]; // 数组包含Item类型的对象  
    getMoveList?: (list: DataType[]) => void;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const fs = window.api.moduleFs();
const shell = window.api.moduleShell();

const Row = (props: RowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });

    // 样式设置
    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        cursor: 'default', // 鼠标样式
        ...(isDragging ? { position: 'relative', zIndex: 500 } : {}),
    };

    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const ListView: React.FC<ListViewProps> = ({ data, getMoveList }) => {
    // 拿到父组件传来的ParentContext
    const isDrop = useContext(ParentContext);
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [index, setIndex] = useState<number>(0);
    // 定义跳转
    const navigate = useNavigate();

    useEffect(() => {
        data != null ? setDataSource(data) : [];
    }, [data]);

    const items: MenuProps['items'] = [
        {
            label: "详情",
            key: '0',
            onClick: () => {
                // 打开浏览器页面查看详情
                shell.openExternal('https://www.baidu.com');
            }
        },
        isDrop ? {
            label: "删除",
            key: '1',
            onClick: async () => {
                if (isDrop) {
                    setDataSource([]);
                    await dataSource.splice(index, 1);
                    await setDataSource(dataSource);

                    fs.readFile(localStorage.stockUrl, "utf8", (err, data) => {
                        if (err) { console.log("读取失败"); return };
                        let arr = JSON.parse(data);
                        arr.splice(index, 1)

                        fs.writeFile(localStorage.stockUrl, JSON.stringify(arr), err => {
                            if (err) { console.log("写入失败"); return };
                            messageApi.open({
                                type: 'success',
                                content: '删除成功！',
                            });
                        })
                    })

                }
            }
        } : null,
    ];

    const columns: ColumnsType<DataType> = [
        {
            title: '股票',
            dataIndex: 'mc',
            render: (_, record) => {
                return <Dropdown menu={{ items }} trigger={['contextMenu']}>
                    <div className="item-spn">{record.mc}</div>
                </Dropdown>
            }
        },
        {
            title: '最新价',
            dataIndex: 'p',
            sortDirections: ['descend', 'ascend'], // 先降序，在升序
            sorter: (a, b) => a.p - b.p,
            render: (_, record) => {
                if (!record.pc) {
                    record.pc = record.zf
                }
                return <Dropdown menu={{ items }} trigger={['contextMenu']}>
                    <div className={`${Number(record.pc) > 0 ? 'rise' : 'fall'} item-spn`}>{record.p}</div>
                </Dropdown>
            }
        },
        {
            title: '涨幅',
            dataIndex: ['pc', 'zf'],
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => Number(a.pc.replace("%", "")) - Number(b.pc.replace("%", "")),
            render: (_, record) => {
                if (!record.pc) {
                    record.pc = record.zf
                }
                return <Dropdown menu={{ items }} trigger={['contextMenu']}>
                    <div className={`${Number(record.pc) > 0 ? 'rise' : 'fall'} item-spn`}>
                        {Number(record.pc) > 0 ? '+' : ''}
                        {record.pc}%
                    </div>
                </Dropdown>
            }
        },
        {
            title: '涨跌',
            dataIndex: 'ud',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => Number(a.ud) - Number(b.ud),
            render: (_, record) => {
                if (!record.ud) {
                    record.ud = (Number(record.p) - (Number(record.p) / (1 + Number(record.zf) / 100))).toFixed(2)
                }
                return <Dropdown menu={{ items }} trigger={['contextMenu']}>
                    <div className={`${Number(record.ud) > 0 ? 'rise' : 'fall'} item-spn`}>
                        {Number(record.ud) > 0 ? '+' : ''}
                        {record.ud}
                    </div>
                </Dropdown>
            }
        },
    ];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                const newArray = arrayMove(prev, activeIndex, overIndex);

                if (getMoveList) {
                    getMoveList(newArray);
                }

                if (isDrop) {
                    let arr = []
                    newArray.forEach(item => {
                        arr.push({
                            name: item.mc,
                            api_code: item.api_code
                        })
                    })

                    fs.writeFile(localStorage.stockUrl, JSON.stringify(arr), err => {
                        if (err) {
                            return
                        }
                        messageApi.open({
                            type: 'success',
                            content: '更新成功！',
                        });
                    })
                }
                return newArray;
            });
        }
    };

    return (
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            {contextHolder}
            <SortableContext
                items={dataSource.map((i) => i.key)}
                strategy={verticalListSortingStrategy}
            >
                <Table
                    size="small"
                    components={{
                        body: {
                            row: Row,
                        },
                    }}
                    rowKey="key"
                    showSorterTooltip={false}
                    pagination={false}
                    columns={columns}
                    sticky={{ offsetHeader: 0 }}
                    dataSource={dataSource}
                    onRow={record => {
                        return {
                            onContextMenu: () => {
                                let i = dataSource.findIndex(item => item.api_code == record.api_code);
                                setIndex(Number(i))
                            }
                        }
                    }}
                />
            </SortableContext>
        </DndContext>
    )
}
export default ListView