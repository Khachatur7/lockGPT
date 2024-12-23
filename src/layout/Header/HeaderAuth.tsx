import { useEffect, useState } from "react";
import styles from './Header.module.css';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';
import { getSchoolSettings } from "../../helpers/API";
import { useDispatch } from "react-redux";
import { resetAuth } from "../../features/auth/authSlice";

const BASE_STORAGE_URL = "https://ce18026.tw1.ru/storage/";

function HeaderAuth() {
	const dispatch = useDispatch();
	const [schoolName, setSchoolName] = useState<string>("");
	const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userData, setUserData] = useState({
		name: "",
		surname: "",
	});
	const userRole = localStorage.getItem('role');

	useEffect(() => {
		const fetchSchoolData = async () => {
			try {
				setLoading(true);
				const data = await getSchoolSettings();
				if(userRole === "student") {
					setUserData({
						name: data.name || "",
						surname: data.surname || "",
					});
				} else {
					setSchoolName(data.school_name || "Название школы");
					setSchoolLogo(data.image || null);
				}
				
			} catch (error) {
				console.error("Ошибка при загрузке данных школы:", error);
			} finally {
				setLoading(false);
			}
		};
	
		fetchSchoolData();
	}, [userRole]);

	console.log("schoolLogo значение:", JSON.stringify(schoolLogo));

	const handleLogout = () => {
		dispatch(resetAuth());
		window.location.href = "/login";
	}
	
	const shotName = userData.name 
		? `${userData.name.charAt(0).toUpperCase()}.` 
		: "";
	
	if (loading) {
		return <></>;
	}

    return (
        <header className={styles['header']}>
			<div className={cn('wrapper')}>
				<div className={styles['header__wrap']}>
					<div className={styles['header__first']}>
						<NavLink to={"/"} className={styles['logo']}>
							<img src="/logo.svg" alt="Логотип"/>
						</NavLink>
						{userRole !== "student" && (
							<>
								<div className={styles['line']}></div>
								<div className={styles['develop']}>
									{schoolLogo && schoolLogo.trim() !== "" && schoolLogo !== BASE_STORAGE_URL && 
										<div className={styles['develop__logo']}>
											<img src={schoolLogo} alt="Логотип"/>
										</div>
									}
									<div className={styles['develop__caption']}>{schoolName}</div>
								</div>
							</>
						)}
					</div>
					<div className={styles['header__last']}>
						{/* <Search className={styles['search']} placeholder='Поиск по платформе' isValid={true}/> */}
						<div className={styles['header__nav']}>
							<NavLink to={'/school-settings'} className={styles['header-btn']}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#233566" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C11.2954 1.25 10.6519 1.44359 9.94858 1.77037C9.26808 2.08656 8.48039 2.55304 7.49457 3.13685L6.74148 3.58283C5.75533 4.16682 4.96771 4.63324 4.36076 5.07944C3.73315 5.54083 3.25177 6.01311 2.90334 6.63212C2.55548 7.25014 2.39841 7.91095 2.32306 8.69506C2.24999 9.45539 2.24999 10.3865 2.25 11.556V12.444C2.24999 13.6135 2.24999 14.5446 2.32306 15.3049C2.39841 16.0891 2.55548 16.7499 2.90334 17.3679C3.25177 17.9869 3.73315 18.4592 4.36076 18.9206C4.96771 19.3668 5.75533 19.8332 6.74148 20.4172L7.4946 20.8632C8.48038 21.447 9.2681 21.9135 9.94858 22.2296C10.6519 22.5564 11.2954 22.75 12 22.75C12.7046 22.75 13.3481 22.5564 14.0514 22.2296C14.7319 21.9134 15.5196 21.447 16.5054 20.8632L17.2585 20.4172C18.2446 19.8332 19.0323 19.3668 19.6392 18.9206C20.2669 18.4592 20.7482 17.9869 21.0967 17.3679C21.4445 16.7499 21.6016 16.0891 21.6769 15.3049C21.75 14.5446 21.75 13.6135 21.75 12.4441V11.556C21.75 10.3866 21.75 9.45538 21.6769 8.69506C21.6016 7.91095 21.4445 7.25014 21.0967 6.63212C20.7482 6.01311 20.2669 5.54083 19.6392 5.07944C19.0323 4.63324 18.2447 4.16683 17.2585 3.58285L16.5054 3.13685C15.5196 2.55303 14.7319 2.08656 14.0514 1.77037C13.3481 1.44359 12.7046 1.25 12 1.25ZM8.22524 4.44744C9.25238 3.83917 9.97606 3.41161 10.5807 3.13069C11.1702 2.85676 11.5907 2.75 12 2.75C12.4093 2.75 12.8298 2.85676 13.4193 3.13069C14.0239 3.41161 14.7476 3.83917 15.7748 4.44744L16.4609 4.85379C17.4879 5.46197 18.2109 5.89115 18.7508 6.288C19.2767 6.67467 19.581 6.99746 19.7895 7.36788C19.9986 7.73929 20.1199 8.1739 20.1838 8.83855C20.2492 9.51884 20.25 10.378 20.25 11.5937V12.4063C20.25 13.622 20.2492 14.4812 20.1838 15.1614C20.1199 15.8261 19.9986 16.2607 19.7895 16.6321C19.581 17.0025 19.2767 17.3253 18.7508 17.712C18.2109 18.1089 17.4879 18.538 16.4609 19.1462L15.7748 19.5526C14.7476 20.1608 14.0239 20.5884 13.4193 20.8693C12.8298 21.1432 12.4093 21.25 12 21.25C11.5907 21.25 11.1702 21.1432 10.5807 20.8693C9.97606 20.5884 9.25238 20.1608 8.22524 19.5526L7.53909 19.1462C6.5121 18.538 5.78906 18.1089 5.24923 17.712C4.72326 17.3253 4.419 17.0025 4.2105 16.6321C4.00145 16.2607 3.88005 15.8261 3.81618 15.1614C3.7508 14.4812 3.75 13.622 3.75 12.4063V11.5937C3.75 10.378 3.7508 9.51884 3.81618 8.83855C3.88005 8.1739 4.00145 7.73929 4.2105 7.36788C4.419 6.99746 4.72326 6.67467 5.24923 6.288C5.78906 5.89115 6.5121 5.46197 7.53909 4.85379L8.22524 4.44744Z" fill="#233566" />
								</svg>
							</NavLink>
							{/* <button className={styles['header-btn']}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C7.71983 1.25 4.25004 4.71979 4.25004 9V9.7041C4.25004 10.401 4.04375 11.0824 3.65717 11.6622L2.50856 13.3851C1.17547 15.3848 2.19318 18.1028 4.51177 18.7351C5.26738 18.9412 6.02937 19.1155 6.79578 19.2581L6.79768 19.2632C7.56667 21.3151 9.62198 22.75 12 22.75C14.378 22.75 16.4333 21.3151 17.2023 19.2632L17.2042 19.2581C17.9706 19.1155 18.7327 18.9412 19.4883 18.7351C21.8069 18.1028 22.8246 15.3848 21.4915 13.3851L20.3429 11.6622C19.9563 11.0824 19.75 10.401 19.75 9.7041V9C19.75 4.71979 16.2802 1.25 12 1.25ZM15.3764 19.537C13.1335 19.805 10.8664 19.8049 8.62349 19.5369C9.33444 20.5585 10.571 21.25 12 21.25C13.4289 21.25 14.6655 20.5585 15.3764 19.537ZM5.75004 9C5.75004 5.54822 8.54826 2.75 12 2.75C15.4518 2.75 18.25 5.54822 18.25 9V9.7041C18.25 10.6972 18.544 11.668 19.0948 12.4943L20.2434 14.2172C21.0086 15.3649 20.4245 16.925 19.0936 17.288C14.4494 18.5546 9.5507 18.5546 4.90644 17.288C3.57561 16.925 2.99147 15.3649 3.75664 14.2172L4.90524 12.4943C5.45609 11.668 5.75004 10.6972 5.75004 9.7041V9Z" fill="#233566" />
								</svg>
								<span></span>
							</button> */}
						</div>
						{userRole === "student" ? (
							<div className={styles['user']}>
								<div className={styles['user__icon']}>
									<img src="/user.svg" alt="Логотип"/>
								</div>
								<div className={styles['user__name']}>
									{shotName || userData.surname ? `${shotName || ''} ${userData.surname || ''}`.trim() : "Студент"}
								</div>
							</div>	
						) : (
							<button className={styles['exit']} onClick={handleLogout}>Выход</button>
						)}
					</div>
				</div>
			</div>
        </header>
    );
}

export default HeaderAuth;