import React, { FC, useEffect, useState } from 'react'
import HomeLayout from '~/components/Layout/HomeLayout'
import StatisticTable from './StatisticTable'
import { Button, Form, Input, InputNumber, Modal, Pagination, Row, Statistic } from 'antd'
import TabList from '~/components/Layout/TabList'
import { useNavigate, useParams } from 'react-router-dom'
import { GiftTable } from './GiftTable'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { addGift, getGiftsSelector } from './gifts.slice'
import { useAppDispatch } from '~/hooks/useRedux'
import { useSelector } from 'react-redux'
import { GiftCard } from './GiftCard'
import { useEventStore } from '~/app/eventStore'
import { useGetGiftsByPageQuery } from './api/gifts.slice'

interface Values {
    name: string;
    price: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch()
    const formRef: React.RefObject<any> | null = React.createRef();
    return (
        <Modal
            open={open}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        const nameValue = formRef.current.getFieldValue(`name`);
                        const priceValue = formRef.current.getFieldValue(`price`);
                        form.resetFields();
                        dispatch(addGift({ key: '6', id: '6', name: nameValue, price: priceValue, imageUrl: "" }))
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                ref={formRef}
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="name"
                    label="Tên quà"
                    rules={[{ required: true, message: 'Hãy ghi tên của phần quà' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Giá trị">
                    <InputNumber addonAfter="$" defaultValue={100} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export const GiftList = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [openCreateGift, setOpenCreateGift] = useState(false);
    const [event, gifts, getEventById, getGiftsEventByEventId] = useEventStore(state => [
        state.event,
        state.gifts,
        state.getEventById,
        state.getGiftsEventByEventId
    ])

    useEffect(() => {
        getEventById(id ? id : '1')
        getGiftsEventByEventId(id)
    }, [])
    // const { data: giftsData } = useGetGiftsByPageQuery(page)
    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setOpenCreateGift(false);
    };
    return (
        <HomeLayout>
            <div className="mb-2 flex min-h-full flex-col">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <ArrowLeftOutlined className='me-4 mb-2' onClick={() => navigate('/tang-qua')} />
                        <Input.Search className="w-[25vw]" placeholder="Tìm kiếm gì đó ..." />
                    </div>
                    <Button onClick={() => setOpenCreateGift(true)}>Thêm quà mới</Button>
                    <CollectionCreateForm
                        open={openCreateGift}
                        onCreate={onCreate}
                        onCancel={() => {
                            setOpenCreateGift(false);
                        }}
                    />
                </div>
                <TabList defaultActiveKey='3' eventId={id} />
                <div className="mt-2 h-full grow rounded-lg bg-bgPrimary px-4 py-2 shadow-md">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-2xl font-medium">{`${event.name}`}- Danh sách phần quà</p>
                        <Statistic value={112893} />
                    </div>
                    {/* <GiftTable /> */}
                    <Row gutter={[16, 32]}>
                        {
                            gifts.map((gift) => {
                                console.log(gift.id, gift.name)
                                return (
                                    <GiftCard giftId={gift.id} giftName={gift.name} price={gift.unit_price} quantity={gift.totalQuantity} cost={gift.totalCost} />
                                )
                            })}
                    </Row>
                    {/* <Pagination
                        defaultPageSize={10}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '15', '20']}
                        style={{ float: 'right' }}
                        defaultCurrent={1}
                        total={2}
                        className='my-16'
                        onChange={(page, pageSize) => {
                            setPage({ page, offset: pageSize, eventId: id })
                        }} /> */}

                </div>
            </div>
        </HomeLayout>
    )
}