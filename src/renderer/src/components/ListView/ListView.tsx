import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
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

interface DataType {
    key: UniqueIdentifier;
    mc: string;
    p: number;
    pc: string;
    ud: string;
    id: string;
    api_code: string;
}
// 定义props的类型 
interface ListViewProps {
    data: DataType[]; // 数组包含Item类型的对象  
}

const columns: ColumnsType<DataType> = [
    {
        title: '股票',
        dataIndex: 'mc',
    },
    {
        title: '最新价',
        dataIndex: 'p',
        sortDirections: ['descend', 'ascend'], // 先降序，在升序
        sorter: (a, b) => a.p - b.p,
        render: (_, record) => {
            return <span className={Number(record.ud) > 0 ? 'rise' : 'fall'}>{record.p}</span>
        }
    },
    {
        title: '涨幅',
        dataIndex: 'pc',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => Number(a.pc.replace("%", "")) - Number(b.pc.replace("%", "")),
        render: (_, record) => {
            return <span className={Number(record.ud) > 0 ? 'rise' : 'fall'}>
                {Number(record.ud) > 0 ? '+' : ''}
                {record.pc}%
            </span>
        }
    },
    {
        title: '涨跌',
        dataIndex: 'ud',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => Number(a.ud) - Number(b.ud),
        render: (_, record) => {
            return <span className={Number(record.ud) > 0 ? 'rise' : 'fall'}>
                {Number(record.ud) > 0 ? '+' : ''}
                {record.ud}
            </span>
        }
    },
];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

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

const ListView: React.FC<ListViewProps> = ({ data }) => {
    const [dataSource, setDataSource] = useState<DataType []>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        data != null ? setDataSource(data) : [];
    }, [data])

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

                let arr = []
                newArray.forEach(item => {
                    arr.push({
                        name: item.mc, 
                        api_code: item.api_code
                    })
                })

                // @ts-ignore
                const fs = window.api.moduleFs();
                fs.writeFile("./self-select-stock.txt", JSON.stringify(arr), err => {
                    if (err) {
                        return
                    }
                    messageApi.open({
                        type: 'success',
                        content: '更新成功！',
                    });
                })

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
                    dataSource={dataSource} />
            </SortableContext>
        </DndContext>
    )
}

export default ListView