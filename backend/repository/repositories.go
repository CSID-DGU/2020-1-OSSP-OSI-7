package repository

type Repositories interface {
	UserRepository() UserRepository
	ClassRepository() ClassRepository
	ClassAdminRepository() ClassAdminRepository
	ClassUserRepository() ClassUserRepository
	ClassQuizSetRepository() ClassQuizSetRepository
	QuizRepository() QuizRepository
	QuizSetRepository() QuizSetRepository
	QuizResultRepository() QuizResultRepository
	QuizSetResultRepository() QuizSetResultRepository
}

type SqlRepositories struct {
	Repository *Repository
	userRepository UserRepository
	classRepository ClassRepository
	classAdminRepository ClassAdminRepository
	classUserRepository ClassUserRepository
	classQuizSetRepository ClassQuizSetRepository
	quizRepository QuizRepository
	quizSetRepository QuizSetRepository
	quizResultRepository QuizResultRepository
	quizSetResultRepository QuizSetResultRepository
}

func NewSqlRepositories(repository *Repository) *SqlRepositories {
	return &SqlRepositories{
		Repository: repository,
	}
}

func (r *SqlRepositories) UserRepository() UserRepository {
	if r.userRepository != nil {
		return r.userRepository
	}

	var v UserRepository = &SqlUserRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) ClassRepository() ClassRepository {
	if r.classRepository != nil {
		return r.classRepository
	}

	var v ClassRepository = &SqlClassRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) ClassAdminRepository() ClassAdminRepository {
	if r.classAdminRepository != nil {
		return r.classAdminRepository
	}

	var v ClassAdminRepository = &SqlClassAdminRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) ClassUserRepository() ClassUserRepository {
	if r.classUserRepository != nil {
		return r.classUserRepository
	}

	var v ClassUserRepository = &SqlClassUserRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) QuizRepository() QuizRepository {
	if r.quizRepository != nil {
		return r.quizRepository
	}

	var v QuizRepository = &SqlQuizRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) ClassQuizSetRepository() ClassQuizSetRepository {
	if r.classQuizSetRepository != nil {
		return r.classQuizSetRepository
	}

	var v ClassQuizSetRepository = &SqlClassQuizSetRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) QuizSetRepository() QuizSetRepository {
	if r.quizSetRepository != nil {
		return r.quizSetRepository
	}

	var v QuizSetRepository = &SqlQuizSetRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) QuizResultRepository() QuizResultRepository {
	if r.quizResultRepository != nil {
		return r.quizResultRepository
	}

	var v QuizResultRepository = &SqlQuizResultRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) QuizSetResultRepository() QuizSetResultRepository {
	if r.quizSetResultRepository != nil {
		return r.quizSetResultRepository
	}

	var v QuizSetResultRepository = &SqlQuizSetResultRepository{
		r.Repository,
	}
	return v
}

