import { useState } from 'react';
import Header from '../components/Header';
import { EuiFlexGroup, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch } from '@elastic/eui';
import MeetingNameField from '../components/FormComponents/MeetingNameField';
import MeetingUsersField from '../components/FormComponents/MeetingUsersField';
import useAuth from '../hooks/useAuth';
import useFetchUsers from '../hooks/useFetchUsers';
import moment from 'moment';
import MeetingDateField from '../components/FormComponents/MeetingDateField';
import CreateMeetingButton from '../components/FormComponents/CreateMeetingButton';
import { FieldErrorType, UserType } from '../utils/Types';
import { addDoc } from 'firebase/firestore';
import { meetingRef } from '../utils/firebaseConfig';
import { generateMeetingID } from '../utils/generateMeetingId';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import MeetingMaximumUserField from '../components/FormComponents/MeetingMaximumUserField';


function VideoConference() {

    useAuth();
    const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid);
    const [users] = useFetchUsers();
    const [createToast] = useToast();

    const navigate = useNavigate();

    const [meetingName, setMeetingName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
    const [startDate, setStartDate] = useState(moment());
    const [size, setSize] = useState(1);
    const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);


    const [showErrors, setShowErrors] = useState<{
        meetingName: FieldErrorType;
        meetingUser: FieldErrorType;
    }>({
        meetingName: {
            show: false,
            message: [],
        },
        meetingUser: {
            show: false,
            message: [],
        },
    });

    const onUserChange = (selectedOptions: any) => {
        setSelectedUsers(selectedOptions)
    };

    const validateForm = () => {
        let errors = false;
        const cloneShowErrors = { ...showErrors }
        if (!meetingName.length) {
            cloneShowErrors.meetingName.show = true;
            cloneShowErrors.meetingName.message = ["Please Enter Meeting Name"];
            errors = true;
        } else {
            cloneShowErrors.meetingName.show = false;
            cloneShowErrors.meetingName.message = [];
        }
        if (!selectedUsers.length) {
            cloneShowErrors.meetingUser.show = true;
            cloneShowErrors.meetingUser.message = ["Please Select a User"];
        } else {
            cloneShowErrors.meetingUser.show = false;
            cloneShowErrors.meetingUser.message = [];
        }

        setShowErrors(cloneShowErrors);
        return errors;
    };

    const createMeeting = async () => {
        if (!validateForm()) {
            const meetingId = generateMeetingID();
            await addDoc(meetingRef, {
                createdBy: uid,
                meetingId,
                meetingName,
                meetingType: anyoneCanJoin ? "anyone-can-join" : "video-conference",
                invitedUsers: anyoneCanJoin
                    ? []
                    : selectedUsers.map((user: UserType) => user.uid),
                meetingDate: startDate.format("L"),
                maxUsers: anyoneCanJoin ? 100 : size,
                status: true,
            });
            createToast({
                title: anyoneCanJoin
                    ? "Anyone can join meeting created successfully"
                    : "Video Conference created successfully",
                type: "success",
            });
            navigate("/")
        }
    }


    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
            }}>

            <Header />

            <EuiFlexGroup
                justifyContent='center'
                alignItems='center'
            >

                <EuiForm>

                    <EuiFormRow
                        display='columnCompressedSwitch'
                        label="Anyone can Join">
                        <EuiSwitch
                            showLabel={false}
                            label="Anyone Can Join"
                            checked={anyoneCanJoin}
                            onChange={e => setAnyoneCanJoin(e.target.checked)}
                            compressed
                        />
                    </EuiFormRow>

                    <MeetingNameField
                        label="Meeting Name"
                        placeholder="Meeting Name"
                        value={meetingName}
                        setMeetingName={setMeetingName}
                        isInvalid={showErrors.meetingName.show}
                        error={showErrors.meetingName.message}
                    />

                    {anyoneCanJoin ? (
                        <MeetingMaximumUserField
                            value={size}
                            setValue={setSize}
                        />
                    ) : (

                        <MeetingUsersField
                            label='Invite User'
                            options={users}
                            onChange={onUserChange}
                            selectedOptions={selectedUsers}
                            singleSelection={false}
                            isClearable={false}
                            placeholder='Select a user'
                            isInvalid={showErrors.meetingUser.show}
                            error={showErrors.meetingUser.message}
                        />

                    )}

                    <MeetingDateField
                        selected={startDate}
                        setStartDate={setStartDate} />

                    <EuiSpacer />

                    <CreateMeetingButton
                        createMeeting={createMeeting}
                    />


                </EuiForm>

            </EuiFlexGroup>
        </div>
    )
}

export default VideoConference;